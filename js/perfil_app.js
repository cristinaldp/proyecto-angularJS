var app = angular.module("miApp", []);

app.controller("PerfilController", function ($scope, $http) {

    $scope.idiomaActual = localStorage.getItem("idiomaActual") || "es";
    $scope.t = I18N[$scope.idiomaActual];

    $scope.usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

    $scope.preferencias = {
        idioma: $scope.idiomaActual,
        tema: localStorage.getItem("temaActual") || "claro"
    };

    $scope.mensajeExito = "";
    $scope.mensajeError = "";

    if (!$scope.usuarioActual || !$scope.usuarioActual.id) {
        $scope.mensajeError = "Debes iniciar sesión para editar tus preferencias.";
    } else {
        cargarPreferencias();
    }

    function cargarPreferencias() {

        $http.get("http://localhost:8085/api/preferencias/usuario/" + $scope.usuarioActual.id)
            .then(function (response) {
                $scope.preferencias.idioma = response.data.idioma || "es";
                $scope.preferencias.tema = response.data.tema || "claro";

                localStorage.setItem("idiomaActual", $scope.preferencias.idioma);
                localStorage.setItem("temaActual", $scope.preferencias.tema);

                aplicarTema($scope.preferencias.tema);
            })
            .catch(function (error) {
                console.error("Error al cargar preferencias:", error);
                $scope.mensajeError = $scope.t.noSePudieronCargarPreferencias;
            });
    }

    $scope.guardarPreferencias = function () {

        $scope.mensajeExito = "";
        $scope.mensajeError = "";

        if (!$scope.usuarioActual || !$scope.usuarioActual.id) {
            $scope.mensajeError = "Debes iniciar sesión para guardar tus preferencias.";
            return;
        }

        $http.put("http://localhost:8085/api/preferencias/usuario/" + $scope.usuarioActual.id, {
            idioma: $scope.preferencias.idioma,
            tema: $scope.preferencias.tema
        })
            .then(function (response) {

                localStorage.setItem("idiomaActual", $scope.preferencias.idioma);
                localStorage.setItem("temaActual", $scope.preferencias.tema);

                $scope.idiomaActual = $scope.preferencias.idioma;
                $scope.t = I18N[$scope.idiomaActual];

                aplicarTema($scope.preferencias.tema);

                $scope.mensajeExito = $scope.t.mensajePreferenciasGuardadas;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            })
            .catch(function (error) {
                console.error("Error al guardar preferencias:", error);
                $scope.mensajeError = $scope.t.noSePudieronGuardarPreferencias;
            });
    };
});

function aplicarTema(tema) {
    if (tema === "oscuro") {
        document.body.classList.add("tema-oscuro");
        document.body.classList.remove("tema-claro");
    } else {
        document.body.classList.add("tema-claro");
        document.body.classList.remove("tema-oscuro");
    }
}