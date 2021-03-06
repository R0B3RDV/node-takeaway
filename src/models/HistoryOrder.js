import {Model, BaseModel} from './Model';
import HistoryProduct from './HistoryProduct';

@Model
export default class HistoryOrder extends BaseModel {
    static relationships = ['user', 'products']

    constructor(takeaway, data, user) {
        super(takeaway, data);
        this.user = user;
    }

    async getDetails() {
        try {
            const data = await this.takeaway.getClient().getHistoryDetails({
                email: this.user.email,
                credentials: this.user.token,
                countryCode: this.user.country.code,
                siteCode: this.user.country.siteCode,
                orderId: this.id
            });
            this.data = Object.assign({}, this.data, data.order);

            this.products = data.order.products.map((product) => new HistoryProduct(this.takeaway, product));
            delete this.data.products;
            return this.products;
        } catch (err) {
            throw err;
        }
    }
};
