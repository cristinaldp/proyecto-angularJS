var detalle_app = angular.module("miApp", []);

detalle_app.controller("DetalleArtistaController", function ($scope, $http) {

    $scope.idiomaActual = localStorage.getItem("idiomaActual") || "es";
    $scope.t = I18N[$scope.idiomaActual];

    var URL_ARTISTAS = "http://localhost:8085/api/artistas";
    var URL_CANCIONES = "http://localhost:8085/api/canciones";

    $scope.artista = null;
    $scope.canciones = [];
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarDetalle = function () {
        var params = new URLSearchParams(window.location.search);
        var id = params.get("id");

        if (!id) {
            $scope.mensaje = "No se ha indicado el id del artista.";
            return;
        }

        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_ARTISTAS + "/" + id)
        .then(function (response) {
            $scope.artista = response.data;
            $scope.cargarCancionesArtista($scope.artista.id);
        })
        .catch(function (error) {
            console.error("Error al cargar el detalle del artista:", error);
            $scope.mensaje = "No se pudo cargar la información del artista.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.cargarCancionesArtista = function (idArtista) {
        $http.get(URL_CANCIONES + "/artista/" + idArtista)
            .then(function (response) {
                $scope.canciones = response.data;
            })
            .catch(function (error) {
                console.error("Error al cargar canciones del artista:", error);
                $scope.canciones = [];
                $scope.mensaje = "No se pudieron cargar las canciones del artista.";
            });
    };

    $scope.abrirVideo = function (cancion) {

        var usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

        if (usuarioActual && usuarioActual.id) {
            $http.post("http://localhost:8085/api/canciones-vistas", {
                idUsuario: usuarioActual.id,
                idCancion: cancion.id
            })
            .then(function () {
                console.log("Canción guardada como vista recientemente");
            })
            .catch(function (error) {
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