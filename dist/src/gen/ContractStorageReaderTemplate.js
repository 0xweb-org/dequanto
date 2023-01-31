class $NAME$ extends ContractStorageReaderBase {
    constructor(address, client, explorer) {
        super(address, client, explorer);
        this.address = address;
        this.client = client;
        this.explorer = explorer;
        /* METHODS */
        this.$slots = $SLOTS$;
        this.$createHandler(this.$slots);
    }
}
