class DataSet {
    constructor(data) {
        this.dataset = new Miso.Dataset({
            data: data,
            extract: (data) => {
                return data.map((e, i) => {
                    if (typeof e === 'object') {
                        e._index = i;
                        return e;
                    } else {
                        return {
                            _index: i,
                            value: e
                        };
                    }
                });
            },
        });
    }

    /**
     * Fetch the dataset
     * @param callback success
     * @param callback error
     * @returns {*}
     */
    fetch(success, error) {
        return this.dataset.fetch({
            success()  {
                if (!!success) {
                    success.call(this);
                }
            },
            error(e)  {
                console.log(e);
                if (!!error) {
                    error.call(this,e);
                }
            }
        });
    }


}

export default DataSet;