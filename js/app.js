var app = angular.module("miApp", []);

app.controller("ArtistaController", function ($scope, $http) {
    var URL_API = "http://localhost:8085/api/artistas";

    $scope.artistas = [];
    $scope.busqueda = "";
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarAleatorios = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API + "/random", {
            params: { limit: 6 }
        })
        .then(function (response) {
            $scope.artistas = response.data;
            if ($scope.artistas.length === 0) {
                $scope.mensaje = "No se han encontrado artistas aleatorios.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar artistas aleatorios:", error);
            $scope.artistas = [];
            $scope.mensaje = "Error al cargar los artistas.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.buscarArtistas = function () {
        if (!$scope.busqueda || $scope.busqueda.trim() === "") {
            $scope.mensaje = "Introduce el nombre del artista que quieras buscar.";
            $scope.artistas = [];
            return;
        }

        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API, {
            params: {
                nombre: $scope.busqueda,
                limit: 20,
                page: 0
            }
        })
        .then(function (response) {
            $scope.artistas = response.data;

            if ($scope.artistas.length === 0) {
                $scope.mensaje = "No se encontraron artistas con ese nombre.";
            }
        })
        .catch(function (error) {
            console.error("Error al buscar artistas:", error);
            $scope.artistas = [];
            $scope.mensaje = "Error al realizar la búsqueda.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.verArtista = function (id) {
        window.location.href = "infoArtista.html?id=" + id;
    };
});


app.controller("DetalleArtistaController", function ($scope, $http) {
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
        if (cancion.url) {
            window.open(cancion.url, "_blank");
        } else {
            $scope.mensaje = "Esta canción no tiene vídeo disponible.";
        }
    };
});

app.controller("AlbumController", function ($scope, $http) {
    var URL_ALBUMES = "http://localhost:8085/api/albumes";

    $scope.albumes = [];
    $scope.busqueda = "";
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarAleatorios = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_ALBUMES + "/random", {
            params: { limit: 6 }
        })
        .then(function (response) {
            $scope.albumes = response.data;
            if ($scope.albumes.length === 0) {
                $scope.mensaje = "No se han encontrado albumes aleatorios.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar albumes aleatorios:", error);
            $scope.albumes = [];
            $scope.mensaje = "Error al cargar los albumes.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.buscarAlbumes = function () {
        if (!$scope.busqueda || $scope.busqueda.trim() === "") {
            $scope.mensaje = "Introduce el nombre del album que quieras buscar.";
            $scope.albumes = [];
            return;
        }

        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_ALBUMES, {
            params: {
                nombre: $scope.busqueda,
                limit: 20,
                page: 0
            }
        })
        .then(function (response) {
            $scope.albumes = response.data;

            if ($scope.albumes.length === 0) {
                $scope.mensaje = "No se encontraron albumes con ese nombre.";
            }
        })
        .catch(function (error) {
            console.error("Error al buscar albumes:", error);
            $scope.albumes = [];
            $scope.mensaje = "Error al realizar la búsqueda.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.verArtista = function (idArtista) {
        window.location.href = "infoArtista.html?id=" + idArtista;
    };

    $scope.cargarNovedades = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_ALBUMES + "/novedades", {
            params: {
                limit: 6
            }
        })
        .then(function (response) {
            $scope.albumes = response.data;

            if ($scope.albumes.length === 0) {
                $scope.mensaje = "No se han encontrado novedades.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar novedades:", error);
            $scope.albumes = [];
            $scope.mensaje = "Error al cargar las novedades.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

});

app.controller("CancionController", function ($scope, $http) {
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