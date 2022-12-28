
export namespace $gen {

    export function toClassName (name: string) {
        let str = name.replace(/[^\w_\-\\/]/g, '');
        str = str.replace(/[\-\\/](\w)/g, (full, letter) => {
            return letter.toUpperCase();
        });
        return str[0].toUpperCase() + str.substring(1);
    }
}
