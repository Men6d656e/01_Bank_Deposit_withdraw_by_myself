-include .env

.PHONY: all test clean deploy-anvil deploy-ganache deploy-sepolia

# --- Shortcuts ---

# 1. Clean the project
clean :; forge clean

# 2. Run all tests
test :; forge test

# 3. Deploy to Anvil
# Uses default local Anvil key - no need for interactive here usually
deploy-anvil:
	forge script script/DeployBank.s.sol --rpc-url ${ANVIL_RPC_URL} --broadcast --private-key ${ANVIL_PRIVATE_KEY} --force

# 4. Deploy to Ganache
# Asks for private key interactively && Remember to uncomment the line in tomal file "env_version"
deploy-ganache:
	forge script script/DeployBank.s.sol --rpc-url $(GANACHE_RPC_URL) --broadcast --interactives 1 --force

# 5. Deploy to Sepolia
# Uses variables from .env and asks for private key interactively
deploy-sepolia:
	forge script script/DeployBank.s.sol \
	--rpc-url $(SEPOLIA_RPC_URL) \
	--broadcast \
	--interactives 1 \
	--verify \
	--etherscan-api-key $(EATHER_SCAN_API_KEY)