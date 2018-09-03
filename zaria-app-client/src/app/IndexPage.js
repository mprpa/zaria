import React, { Component } from 'react';

import ProductList from '../user/ProductList';
import AdminIndex from '../user/admin/AdminIndex';

class IndexPage extends Component{

    render () {

        if(this.props.isAdmin) {
            return <AdminIndex {...this.props} />
        } else {
            return <ProductList {...this.props} />
        }

    }
}

export default IndexPage;