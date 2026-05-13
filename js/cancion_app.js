var cancion_app = angular.module("miApp", []);

cancion_app.controller("CancionController", function ($scope, $http) {
    var URL_API = "http://localhost:8085/api/canciones";

    $scope.canciones = [];
    $scope.busqueda = "";
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarAleatorias = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API + "/random", {
            params: { limit: 6 }
        })
        .then(function (response) {
            $scope.canciones = response.data;
            if ($scope.canciones.length === 0) {
                $scope.mensaje = "No se han encontrado canciones aleatorias.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar canciones aleatorias:", error);
            $scope.canciones = [];
            $scope.mensaje = "Error al cargar las canciones.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.buscarCanciones = function () {
        if (!$scope.busqueda || $scope.busqueda.trim() === "") {
            $scope.mensaje = "Introduce el nombre de la canción que quieras buscar.";
            $scope.canciones = [];
            return;
        }

        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API, {
            params: {
                titulo: $scope.busqueda,
                limit: 20,
                page: 0
            }
        })
        .then(function (response) {
            $scope.canciones = response.data;

            if ($scope.canciones.length === 0) {
                $scope.mensaje = "No se encontraron canciones con ese nombre.";
            }
        })
        .catch(function (error) {
            console.error("Error al buscar canciones:", error);
            $scope.canciones = [];
            $scope.mensaje = "Error al realizar la búsqueda.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.abrirVideo = function (cancion) {
        if (cancion.url) {
            window.open(cancion.url, "_blank");
        } else {
            $scope.mensaje = "Esta canción no tiene vídeo disponible.";
        }
    };

    $scope.cargarTopCanciones = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API + "/top", {
            params: {
                limit: 5
            }
        })
        .then(function (response) {
            $scope.canciones = response.data;

            if ($scope.canciones.length === 0) {
                $scope.mensaje = "No se encontraron canciones en el top global.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar el top global:", error);
            $scope.canciones = [];
            $scope.mensaje = "Error al cargar el top global.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };
});

cancion_app.controller("loginController", function ($scope, $http) {

    $scope.loginVisible = false;
    $scope.menuPerfilVisible = false;

    $scope.loginData = {
        identificador: "",
        contrasena: ""
    };

    $scope.usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

    $scope.abrirLogin = function () {
        $scope.loginVisible = true;
    };

    $scope.cerrarLogin = function () {
        $scope.loginVisible = false;
    };

    $scope.iniciarSesion = function () {

        $http.post("http://localhost:8085/api/usuarios/login", $scope.loginData)
            .then(function (response) {

                $scope.usuarioActual = response.data;

                localStorage.setItem("usuarioActual", JSON.stringify(response.data));

                $scope.loginVisible = false;

                $scope.loginData = {
                    identificador: "",
                    contrasena: ""
                };

            })
            .catch(function (error) {
                console.error("Error de login:", error);
                alert("Usuario o contraseña incorrectos.");
            });
    };

    $scope.cerrarSesion = function () {
        localStorage.removeItem("usuarioActual");
        $scope.usuarioActual = null;
        $scope.menuPerfilVisible = false;
    };

    $scope.toggleMenuPerfil = function () {
        $scope.menuPerfilVisible = !$scope.menuPerfilVisible;
    };
});