type ClickAttributionPayload = {
  gclid: string;
  gbraid: string;
  wbraid: string;
};

interface BetClearAttributionApi {
  gclid: () => string;
  gbraid: () => string;
  wbraid: () => string;
  all: () => ClickAttributionPayload;
}

interface Window {
  BetClearAttribution?: BetClearAttributionApi;
}
