1: đăng nhập / đăng ký
2: sản phẩm ( nước nắm )
3: mua hàng ( thanh toán )
4: đơn hàng
5: noti
6: hệ thông của hàng. 
7: upload ảnh

web:
    bán hàng: 
    admin: curd sản phẩm và user, đơn hàng, hệ thông của hàng, noti

1: sản phẩm{
    trang thái,
    tên sản phẩm,
    mô tả
    imageBanner: [hình ảnh]
    imageCover: [hình ảnh]
    giá ( giá niêm yết )
    biến {
        loại:
        kích thước (size)
        giá,
    }
}

2 user: {
    name,
    email,
    password,
    địa chỉ,
    số điện thoại
}

4: đơn hàng: {
    buyer
    sản phẩm
    trang thái thanh toán ( đã thanh toán | chưa thanh toán )
    trang thái đơn hàng ( )

}

GET api/treding -> dự vào order và sản phẩm -> sản phẩm nào được mua nhièu nhất và ít nhất