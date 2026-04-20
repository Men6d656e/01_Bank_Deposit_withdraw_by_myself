// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetWorkConfig {
        uint256 chainId;
    }

    NetWorkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 31337) {
            activeNetworkConfig = getAnvilConfig();
        } else if (block.chainid == 1337 || block.chainid == 5777) {
            activeNetworkConfig = getGanacheConfig();
        } else {
            activeNetworkConfig = getSepoliaConfig();
        }
    }

    function getAnvilConfig() public pure returns (NetWorkConfig memory) {
        return NetWorkConfig({chainId: 31337});
    }

    function getGanacheConfig() public pure returns (NetWorkConfig memory) {
        return NetWorkConfig({chainId: 1337}); // 1337 or 5777
    }

    function getSepoliaConfig() public pure returns (NetWorkConfig memory) {
        return NetWorkConfig({chainId: 11155111});
    }
}
