import { Middleware, MiddlewareCallbackParams } from "openapi-fetch";

export const FixUrlMiddleware: Middleware = {
  async onRequest({ request, options }) {
    // client urls looks like .../?module=account&action=balance?...
    // so we need small middleware to fix it
    // https://api.etherscan.io/api/?module=account&action=balance?address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest
    const newUrl = request.url.replace(/(\?module=[A-Za-z]+&action=[A-Za-z]+.*?)\?/, "$1&");
    const newReq = new Request(newUrl, request);
    return newReq;
  },
};

export class ApiKeyMiddleware implements Middleware {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async onRequest({ request }: MiddlewareCallbackParams) {
    const url = new URL(request.url);
    url.searchParams.append("apikey", this.apiKey);

    const newReq = new Request(url.toString(), request);
    return newReq;
  }
}
