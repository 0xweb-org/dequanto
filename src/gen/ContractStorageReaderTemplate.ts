

class $NAME$ extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createReader(this.$slots);
    }

/* METHODS */

    $slots = $SLOTS$

}
