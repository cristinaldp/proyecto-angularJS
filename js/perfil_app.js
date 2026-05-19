var app = angular.module("miApp", []);

app.controller("PerfilController", function($scope, $http) {

    $scope.idiomaActual = localStorage.getItem("idiomaActual") || "es";
    $scope.t = I18N[$scope.idiomaActual];

    $scope.usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

    $scope.preferencias = {
        idioma: $scope.idiomaActual
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
            .then(function(response) {
                $scope.preferencias.idioma = response.data.idioma || "es";
            })
            .catch(function(error) {
                console.error("Error al cargar preferencias:", error);
                $scope.mensajeError = "No se pudieron cargar tus preferencias.";
            });
    }

    $scope.guardarPreferencias = function() {

        $scope.mensajeExito = "";
        $scope.mensajeError = "";

        if (!$scope.usuarioActual || !$scope.usuarioActual.id) {
            $scope.mensajeError = "Debes iniciar sesión para guardar tus preferencias.";
            return;
        }

        $http.put("http://localhost:8085/api/preferencias/usuario/" + $scope.usuarioActual.id + "/idioma", {
            idioma: $scope.preferencias.idioma
        })
        .then(function() {

            localStorage.setItem("idiomaActual", $scope.preferencias.idioma);

            $scope.idiomaActual = $scope.preferencias.idioma;
            $scope.t = I18N[$scope.idiomaActual];

            $scope.mensajeExito = "Preferencias guardadas correctamente.";

            setTimeout(function() {
                window.location.reload();
            }, 700);
        })
        .catch(function(error) {
            console.error("Error al guardar preferencias:", error);
            $scope.mensajeError = "No se pudieron guardar las preferencias.";
        });
    };
});