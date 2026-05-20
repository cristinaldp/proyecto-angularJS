var genero_app = angular.module("miApp", []);

genero_app.controller("GeneroController", function ($scope, $http) {

    $scope.idiomaActual = localStorage.getItem("idiomaActual") || "es";
    $scope.t = I18N[$scope.idiomaActual];

    var temaActual = localStorage.getItem("temaActual") || "claro";

    if (temaActual === "claro") {
        document.body.classList.add("tema-claro");
        document.body.classList.remove("tema-oscuro");
    } else {
        document.body.classList.add("tema-oscuro");
        document.body.classList.remove("tema-claro");
    }


    var URL_GENEROS = "http://localhost:8085/api/generos";
    var URL_ARTISTAS = "http://localhost:8085/api/artistas";
    var URL_ALBUMES = "http://localhost:8085/api/albumes";

    $scope.generos = [];
    $scope.artistas = [];
    $scope.albumes = [];

    $scope.generoSeleccionado = null;
    $scope.tipoResultado = "todo";
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarGeneros = function () {
        $http.get(URL_GENEROS)
            .then(function (response) {
                $scope.generos = response.data;
            })
            .catch(function (error) {
                console.error("Error al cargar géneros:", error);
                $scope.mensaje = "Error al cargar los géneros.";
            });
    };

    $scope.filtrarPorGenero = function () {
        if (!$scope.generoSeleccionado) {
            $scope.artistas = [];
            $scope.albumes = [];
            $scope.mensaje = "";
            return;
        }

        var idGenero = $scope.generoSeleccionado.id;

        $scope.cargando = true;
        $scope.mensaje = "";

        $scope.artistas = [];
        $scope.albumes = [];

        if ($scope.tipoResultado === "todo" || $scope.tipoResultado === "artistas") {
            $http.get(URL_ARTISTAS + "/genero/" + idGenero)
                .then(function (response) {
                    $scope.artistas = response.data;
                })
                .catch(function (error) {
                    console.error("Error al cargar artistas por género:", error);
                    $scope.mensaje = "Error al cargar los artistas.";
                });
        }

        if ($scope.tipoResultado === "todo" || $scope.tipoResultado === "albumes") {
            $http.get(URL_ALBUMES + "/genero/" + idGenero)
                .then(function (response) {
                    $scope.albumes = response.data;
                })
                .catch(function (error) {
                    console.error("Error al cargar álbumes por género:", error);
                    $scope.mensaje = "Error al cargar los álbumes.";
                })
                .finally(function () {
                    $scope.cargando = false;
                });
        } else {
            $scope.cargando = false;
        }
    };

    $scope.verArtista = function (idArtista) {
        window.location.href = "infoArtista.html?id=" + idArtista;
    };

    $scope.abrirAlbumSpotify = function (album) {

        console.log("Álbum seleccionado:", album);
        console.log("Título:", album.titulo);
        console.log("Artista:", album.nombreArtista);

        $http.get("http://localhost:8085/api/spotify/album/url", {
            params: {
                titulo: album.titulo,
                artista: album.nombreArtista
            }
        })
        .then(function (response) {

            var spotifyUrl = response.data.url;

            if (spotifyUrl) {
                window.open(spotifyUrl, "_blank");
            } else {
                alert("No se ha encontrado este álbum en Spotify.");
            }
        })
        .catch(function (error) {
            console.error("Error al abrir álbum en Spotify:", error);
            alert("No se pudo obtener el enlace de Spotify.");
        });
    };

});