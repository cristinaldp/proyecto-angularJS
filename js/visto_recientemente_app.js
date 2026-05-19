var vistas_app = angular.module("miApp", []);

vistas_app.controller("VistoRecientementeController", function ($scope, $http) {

    $scope.idiomaActual = localStorage.getItem("idiomaActual") || "es";
    $scope.t = I18N[$scope.idiomaActual];

    $scope.canciones = [];
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarVistas = function () {

        var usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get("http://localhost:8085/api/canciones-vistas/usuario/" + usuarioActual.id)
            .then(function (response) {
                $scope.canciones = response.data;

                if ($scope.canciones.length === 0) {
                    $scope.mensaje = "Todavía no has visto ninguna canción.";
                }
            })
            .catch(function (error) {
                console.error("Error al cargar canciones vistas:", error);
                $scope.mensaje = "Error al cargar las canciones vistas recientemente.";
            })
            .finally(function () {
                $scope.cargando = false;
            });
    };

    $scope.abrirVideo = function (cancion) {

        var usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

        if (usuarioActual && usuarioActual.id) {
            $http.post("http://localhost:8085/api/canciones-vistas", {
                idUsuario: usuarioActual.id,
                idCancion: cancion.id
            })
            .then(function  (){
                console.log("canción guardada como vista recientemente")
            })
            .catch(function (error){
                console.error("Error al guardar canción vista:", error);
            });
        }

        if (cancion.url) {
            window.open(cancion.url, "_blank");
        } else {
            $scope.mensaje = "Esta canción no tiene vídeo disponible.";
        }
    };
});