<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Styles -->
    <style>
        html, body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Nunito', sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
        }

        .imgcontainer {
            text-align: center;
        }

        img.avatar {
            width: 50%;
            border-radius: 50%;
        }

    </style>
</head>
<body style="background:#f1f1f1">
<div class="container">
    <div style="height: 6rem"></div>
    <div class="row">
        <div class="col-6 offset-3 p-5 ">
            <form class="border shadow p-3 mb-5 rounded bg-white" method="post" action="{{ url("/register")}}">
                @csrf
                <div class="imgcontainer">
                    <img src="/logo.png" alt="Avatar" class="avatar">
                </div>
                <div class="mb-4">
                    <label for="exampleInputEmail1" class="form-label text-black fw-bold">User name <span
                            class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="exampleInputEmail1" name="name" aria-describedby="emailHelp">
                </div>

                <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label text-black fw-bold">Email <span
                            class="text-danger">*</span></label>
                    <input type="email" class="form-control" name="email" id="exampleInputPassword1">
                </div>
                <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label text-black fw-bold">Password <span
                            class="text-danger">*</span></label>
                    <input type="password" name="password" class="form-control" id="exampleInputPassword1">
                </div>
                <div class="mb-4">
                    <button type="submit" class="btn btn-danger form-control fw-bold">Register</button>
                </div>
                <div class="row">
                    <div class="col-8">
                        <div class="mb-2 form-check">
                            <input type="checkbox" class="form-check-input" id="exampleCheck1">
                            <label class="form-check-label" for="exampleCheck1">I agree to Typeform’s Terms of Service</label>
                        </div>
                    </div>
                    <div class="col-4 text-end mb-2"><a href="/">Sign in </a></div>
                </div>
            </form>
        </div>
    </div>
</div>
</body>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>
</html>
