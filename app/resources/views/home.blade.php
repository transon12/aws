<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Style+Script&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"/>


    <!-- Styles -->
    <style>
        * {
            padding: 0;
            margin: 0;
        }

        html, body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Nunito', sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
            max-width: 100vw;
            overflow-x: hidden;
        }


        img.avatar {
            width: 7%;
            border-radius: 7%;
        }

        .font {
            font-family: 'Style Script', cursive;
            font-size: 30px;
            font-weight: 600;
            color: #ed2236;
        }

        .logo {
            display: flex;
            align-content: center;
            align-items: center;
            vertical-align: middle;
        }

        .user {
            display: flex;
            text-align: right;
            padding-top: .75rem;
            align-items: center;
            justify-content: flex-end;
            align-content: center;
            vertical-align: middle;
        }

        .user i {
            font-size: 32px;
        }

        .user div {
            align-content: center;
            align-items: center;
            vertical-align: middle;
            text-align: center;
        }
        header{
            border-bottom: 1px solid #ed2236 ;
        }

    </style>

</head>
<body style="background: #f1f1f1">
<header style="background: #ffffff">
    <div class="p-2 ps-3">
        <div class="row">
            <div class="col-6">
                <div class="logo">
                    <img src="/logo.png" alt="Avatar" class="avatar">
                    <span class="font">Project New</span>
                </div>
            </div>
            <div class="col-6">
                <div class="user pe-3">
                    <div class="d-flex">
                        <i class="fa fa-user-circle"></i>
                        <span class="ps-3 fw-bold ">{{$user->name}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</header>
<div class="container mt-5 p-3 bg-white " style="border-radius: 10px">
    <div class="text-center">
        <h5 class="fw-bold">Danh sách sản phẩm</h5>
    </div>
    <table class="table table-bordered">
        <thead>
        <tr>
            <th>Tên</th>
            <th>Tên sản phẩm</th>
            <th>Trạng thái</th>
            <th>Ngày cập nhật</th>
        </tr>
        </thead>
        <tbody>
        @foreach($list as $item)
            <tr>
                <td>{{$item->ten}}</td>
                <td>{{$item->donVi}}</td>
                <td>{{$item->strIsActive}}</td>
                <td>{{$item->strNgayTao}}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
</body>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>
</html>
