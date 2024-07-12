import createClient from "openapi-fetch";
import fetchMock from "jest-fetch-mock";
import { FixUrlMiddleware, ApiKeyMiddleware } from "../middleware";
import { paths } from "../schema";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("FixUrlMiddleware", () => {
  it("should successfully GET data from the endpoint", async () => {
    const client = createClient<paths>({ baseUrl: "https://api.etherscan.io/api", fetch: fetchMock });
    client.use(FixUrlMiddleware);

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "1",
        message: "OK",
        result: "12345",
      })
    );

    const { data, error } = await client.GET("/?module=account&action=balance", {
      params: {
        query: {
          address: "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
          tag: "latest",
        },
      },
    });

    expect(fetchMock.mock.calls.length).toBeGreaterThan(0);
    expect(fetchMock.mock.calls[0]).not.toBeUndefined;
    expect((fetchMock.mock.calls[0]![0] as Request).url).toBe(
      "https://api.etherscan.io/api/?module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest"
    );
  });
});

describe("ApiKeyMiddleware", () => {
  it("should add the API key to the request URL", async () => {
    const client = createClient<paths>({ baseUrl: "https://api.etherscan.io/api", fetch: fetchMock });
    const apiKey = "12345abcdef";
    const apiKeyMiddleware = new ApiKeyMiddleware(apiKey);
    client.use(apiKeyMiddleware);

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "1",
        message: "OK",
        result: "12345",
      })
    );

    const { data, error } = await client.GET("/?module=account&action=balance", {
      params: {
        query: {
          address: "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
          tag: "latest",
        },
      },
    });

    expect(fetchMock.mock.calls.length).toBeGreaterThan(0);
    expect(fetchMock.mock.calls[0]).not.toBeUndefined;
    expect((fetchMock.mock.calls[0] as any)[0].url).toContain(`apikey=${apiKey}`);
  });
});
