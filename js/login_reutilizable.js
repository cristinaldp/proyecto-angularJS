angular.module("miApp").component("loginWidget", {
    template: `
        <div class="inicio-sesion">

            <button class="btn-acceso"
                    ng-if="!$ctrl.usuarioActual"
                    ng-click="$ctrl.abrirLogin()">
                Acceso
            </button>

            <button class="btn-perfil"
                    ng-if="$ctrl.usuarioActual"
                    ng-click="$ctrl.toggleMenuPerfil()">
                Perfil
            </button>

            <button class="btn-logout"
                    ng-if="$ctrl.usuarioActual"
                    ng-click="$ctrl.cerrarSesion()">
                Cerrar sesión
            </button>

            <div class="menu-perfil" ng-if="$ctrl.menuPerfilVisible">
                <p class="nombre-usuario">{{ $ctrl.usuarioActual.nickname }}</p>
                <button>Mi perfil</button>
                <button ng-click="$ctrl.irVistoRecientemente()">
                    Visto recientemente
                </button>
            </div>

            <div class="modal-login" ng-if="$ctrl.loginVisible">
                <div class="login-contenido">

                    <button class="cerrar-modal" ng-click="$ctrl.cerrarLogin()">×</button>

                    <h2>Iniciar sesión</h2>

                    <label>Usuario o email</label>
                    <input type="text"
                           ng-model="$ctrl.loginData.identificador"
                           placeholder="Introduce tu usuario o email">

                    <label>Contraseña</label>
                    <input type="password"
                           ng-model="$ctrl.loginData.contrasena"
                           placeholder="Introduce tu contraseña"
                           ng-keypress="$event.which === 13 && $ctrl.iniciarSesion()">

                    <button class="btn-login" ng-click="$ctrl.iniciarSesion()">
                        Entrar
                    </button>

                </div>
            </div>

        </div>
    `,

    controller: function ($http) {
        var ctrl = this;

        ctrl.loginVisible = false;
        ctrl.menuPerfilVisible = false;

        ctrl.loginData = {
            identificador: "",
            contrasena: ""
        };

        ctrl.$onInit = function () { /*esta función me guarda el inicio de sesión en local para no empezar de cero en cada página*/
            ctrl.usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
        };

        ctrl.abrirLogin = function () {
            ctrl.loginVisible = true;
        };

        ctrl.cerrarLogin = function () {
            ctrl.loginVisible = false;
        };

        ctrl.iniciarSesion = function () {

            $http.post("http://localhost:8085/api/usuarios/login", ctrl.loginData)
                .then(function (response) {

                    ctrl.usuarioActual = response.data;

                    localStorage.setItem("usuarioActual", JSON.stringify(response.data));

                    ctrl.loginVisible = false;
                    ctrl.menuPerfilVisible = false;

                    ctrl.loginData = {
                        identificador: "",
                        contrasena: ""
                    };
                })
                .catch(function (error) {
                    console.error("Error de login:", error);
                    alert("Usuario o contraseña incorrectos.");
                });
        };

        ctrl.cerrarSesion = function () {
            localStorage.removeItem("usuarioActual");
            ctrl.usuarioActual = null;
            ctrl.menuPerfilVisible = false;
        };

        ctrl.toggleMenuPerfil = function () {
            ctrl.menuPerfilVisible = !ctrl.menuPerfilVisible;
        };

        ctrl.irVistoRecientemente = function () {
            window.location.href = "visto-recientemente.html";
        };
    }
});