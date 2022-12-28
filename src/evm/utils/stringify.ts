import { $is } from '@dequanto/utils/$is';


export default (item: any) => {
    if ($is.BigInt(item)) {
        return item.toString(16);
    } else if (!item.wrapped) {
        return item.toString();
    } else {
        return '(' + item.toString() + ')';
    }
};
