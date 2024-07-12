import createClient from "openapi-fetch";
import { paths } from "../schema";
import { ApiKeyMiddleware, FixUrlMiddleware } from "../middleware";
import "dotenv/config";

jest.setTimeout(20000);

describe("Etherscan API client", () => {
  it("should successfully GET account balance", async () => {
    const client = createClient<paths>({ baseUrl: "https://api.etherscan.io/api" });
    const apikeyMw = new ApiKeyMiddleware(process.env.ETHERSCAN_API_KEY ?? "");
    client.use(FixUrlMiddleware, apikeyMw);

    const { data, error } = await client.GET("/?module=account&action=balance", {
      params: {
        query: {
          address: "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
          tag: "latest",
        },
      },
    });
    expect(error).toBeUndefined();
    expect(data).toHaveProperty("status", "1");
    expect(data).toHaveProperty("message", expect.stringContaining("OK"));
    expect(data).toHaveProperty("result");
    expect(data!.result).toBe("308273964019654915231534");
  });
});
