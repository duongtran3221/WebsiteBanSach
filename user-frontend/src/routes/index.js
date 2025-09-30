import HomePage from "../views/HomePage/HomePage"
import Cart from "../views/Cart/Cart"
import CategoryList from "../views/CategoryList/CategoryList"
import DetailsProduct from "../views/DetailsProduct/DetailsProduct"
import SearchPage from "../views/SearchPage/Search"
import PaymentPage from "../views/Payment/Payment"
import ProfilePage from "../views/Profile/Profile"
import OrderPage from "../views/OrderUser/Order"

const publicRoutes = [
    {path:"/", component: HomePage},
    {path:"/cart", component: Cart},
    {path:"/category/:ten_the_loai", component: CategoryList},
    {path:"/details/:ma_sach", component: DetailsProduct},
    {path:"/search/:searchTerm", component: SearchPage},
    {path:"/payment/", component: PaymentPage},
    {path:"/profile/", component: ProfilePage},
    {path:"/order/", component: OrderPage},
]

const privateRoutes = [
    
]

export {publicRoutes, privateRoutes};