

class $NAME$ extends ContractStorageReaderBase {
    constructor(
        address,
        client,
        explorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

/* METHODS */

    $slots = $SLOTS$
}
