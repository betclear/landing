#!/usr/bin/env python3
"""Upload Stripe-attributed conversions to Google Ads (click conversions)."""

from __future__ import annotations

import hashlib
import os
import re
from datetime import datetime, timezone
from typing import Optional

import google.auth
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

CUSTOMER_ID = os.environ.get("GOOGLE_ADS_CUSTOMER_ID", "8314947794")
LOGIN_CUSTOMER_ID = os.environ.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID", "1230399435")
TRIAL_ACTION_ID = os.environ.get("BETCLEAR_TRIAL_CONVERSION_ACTION_ID", "7694794750")
PURCHASE_ACTION_ID = os.environ.get(
    "BETCLEAR_PURCHASE_CONVERSION_ACTION_ID", "7694795221"
)


def _client() -> GoogleAdsClient:
    creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/adwords"])
    return GoogleAdsClient(
        credentials=creds,
        developer_token=os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
        login_customer_id=LOGIN_CUSTOMER_ID,
        use_proto_plus=True,
    )


def _hash_email(email: str) -> str:
    normalized = email.strip().lower()
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def _fmt_dt(dt: Optional[datetime] = None) -> str:
    """Google Ads expects 'yyyy-mm-dd HH:mm:ss+|-HH:mm'."""
    if dt is None:
        dt = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    # Example: 2026-07-23 12:00:00+00:00
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S+00:00")


def upload_click_conversion(
    *,
    conversion_action_id: str,
    gclid: str = "",
    gbraid: str = "",
    wbraid: str = "",
    conversion_value: float = 0.0,
    currency_code: str = "USD",
    order_id: str = "",
    email: str = "",
    conversion_date_time: Optional[datetime] = None,
) -> dict:
    if not (gclid or gbraid or wbraid or email):
        return {"ok": False, "error": "need gclid/gbraid/wbraid or email"}

    client = _client()
    conv = client.get_type("ClickConversion")
    conv.conversion_action = client.get_service(
        "ConversionActionService"
    ).conversion_action_path(CUSTOMER_ID, conversion_action_id)
    conv.conversion_date_time = _fmt_dt(conversion_date_time)
    conv.conversion_value = float(conversion_value)
    conv.currency_code = currency_code
    if order_id:
        conv.order_id = order_id

    if gclid:
        conv.gclid = gclid
    elif gbraid:
        conv.gbraid = gbraid
    elif wbraid:
        conv.wbraid = wbraid

    if email:
        uid = client.get_type("UserIdentifier")
        uid.hashed_email = _hash_email(email)
        # user_identifier_source optional
        conv.user_identifiers.append(uid)

    req = client.get_type("UploadClickConversionsRequest")
    req.customer_id = CUSTOMER_ID
    req.conversions.append(conv)
    req.partial_failure = True

    try:
        resp = client.get_service("ConversionUploadService").upload_click_conversions(
            request=req
        )
        result = {"ok": True, "partial_failure": str(resp.partial_failure_error) if resp.partial_failure_error else None}
        if resp.results:
            result["gclid"] = getattr(resp.results[0], "gclid", None)
        return result
    except GoogleAdsException as e:
        return {
            "ok": False,
            "errors": [err.message for err in e.failure.errors],
            "request_id": e.request_id,
        }


def upload_trial(*, gclid: str = "", email: str = "", order_id: str = "", **kwargs) -> dict:
    return upload_click_conversion(
        conversion_action_id=TRIAL_ACTION_ID,
        gclid=gclid,
        email=email,
        order_id=order_id or f"trial_{gclid or email}",
        conversion_value=0.0,
        **kwargs,
    )


def upload_purchase(
    *,
    gclid: str = "",
    email: str = "",
    value: float = 29.99,
    order_id: str = "",
    currency_code: str = "USD",
    **kwargs,
) -> dict:
    return upload_click_conversion(
        conversion_action_id=PURCHASE_ACTION_ID,
        gclid=gclid,
        email=email,
        order_id=order_id,
        conversion_value=value,
        currency_code=currency_code,
        **kwargs,
    )


# --- Example Stripe webhook handler (Flask) ---
def example_stripe_webhook_flask():
    """
    Sketch only — wire into your real app.

    from flask import Flask, request
    import stripe
    app = Flask(__name__)

    @app.post("/webhooks/stripe")
    def stripe_webhook():
        payload = request.data
        sig = request.headers.get("Stripe-Signature")
        event = stripe.Webhook.construct_event(
            payload, sig, os.environ["STRIPE_WEBHOOK_SECRET"]
        )

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            meta = session.get("metadata") or {}
            gclid = meta.get("gclid", "")
            email = (session.get("customer_details") or {}).get("email") or ""
            mode = session.get("mode")  # payment | subscription
            # Trial often: subscription with trial_period_days
            upload_trial(gclid=gclid, email=email, order_id=session["id"])

        if event["type"] == "invoice.paid":
            inv = event["data"]["object"]
            # amount_paid is cents
            value = (inv.get("amount_paid") or 0) / 100.0
            if value <= 0:
                return "", 200
            # Pull gclid from subscription metadata if you stored it there
            meta = inv.get("metadata") or {}
            gclid = meta.get("gclid", "")
            email = inv.get("customer_email") or ""
            upload_purchase(
                gclid=gclid,
                email=email,
                value=value,
                order_id=inv["id"],
                currency_code=(inv.get("currency") or "usd").upper(),
            )
        return "", 200
    """


if __name__ == "__main__":
    # Dry sanity: missing gclid should fail softly
    print(upload_trial(gclid="", email=""))
