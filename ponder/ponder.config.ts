import { createConfig } from "@ponder/core";
import { http } from "viem";
import { mantleTestnet } from "viem/chains";

export default createConfig({
    networks: {
        mantleTestnet: {
            chainId: 5001,
            transport: http(process.env.PONDER_RPC_URL_1),
        },
    },
    contracts: {
        // Add contracts here
    },
});
