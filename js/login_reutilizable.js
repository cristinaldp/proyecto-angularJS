angular.module("miApp").component("loginWidget", {
    template: `
        <div class="inicio-sesion">

            <button class="btn-acceso" ng-if="!$ctrl.usuarioActual" ng-click="$ctrl.abrirLogin()">
                {{ $ctrl.t.acceso }}
            </button>

            <button class="btn-perfil" ng-if="$ctrl.usuarioActual"  ng-click="$ctrl.toggleMenuPerfil()">
                {{ $ctrl.t.perfil }}
            </button>

            <button class="btn-logout" ng-if="$ctrl.usuarioActual" ng-click="$ctrl.cerrarSesion()">
                {{ $ctrl.t.cerrarSesion }}
            </button>

            <div class="menu-perfil" ng-if="$ctrl.menuPerfilVisible">
                <p class="nombre-usuario">{{ $ctrl.usuarioActual.nickname }}</p>

                <button ng-click="$ctrl.irPerfil()">
                    {{ $ctrl.t.miPerfil }}
                </button>

                <button ng-click="$ctrl.irVistoRecientemente()">
                    {{ $ctrl.t.vistoRecientemente }}
                </button>
            </div>

        </div>
        <div class="modal-login" ng-if="$ctrl.loginVisible">
            <div class="login-contenido">

                <button class="cerrar-modal" ng-click="$ctrl.cerrarLogin()">×</button>

                <div ng-if="!$ctrl.modoRegistro">

                    <h2>{{ $ctrl.t.iniciarSesion }}</h2>

                    <label>{{ $ctrl.t.usuarioEmail }}</label>
                    <input type="text" ng-model="$ctrl.loginData.identificador" placeholder="{{ $ctrl.t.usuarioEmail }}">

                    <label>{{ $ctrl.t.contrasena }}</label>
                    <input type="password" ng-model="$ctrl.loginData.contrasena" placeholder="{{ $ctrl.t.contrasena }}" ng-keypress="$event.which === 13 && $ctrl.iniciarSesion()">

                    <button class="btn-login" ng-click="$ctrl.iniciarSesion()">
                        {{ $ctrl.t.entrar }}
                    </button>

                    <button class="btn-login btn-registro" ng-click="$ctrl.mostrarRegistro()">
                        {{ $ctrl.t.registrarse }}
                    </button>

                </div>

                <div ng-if="$ctrl.modoRegistro">

                    <h2>{{ $ctrl.t.registrarse }}</h2>

                    <label>{{ $ctrl.t.email }}</label>
                    <input type="email" ng-model="$ctrl.registroData.email" placeholder="email@gmail.com">

                    <label>{{ $ctrl.t.nickname }}</label>
                    <input type="text" ng-model="$ctrl.registroData.nickname" placeholder="{{ $ctrl.t.nickname }}">

                    <label>{{ $ctrl.t.contrasena }}</label>
                    <input type="password" ng-model="$ctrl.registroData.contrasena" placeholder="{{ $ctrl.t.placeholderContrasena }}" ng-keypress="$event.which === 13 && $ctrl.registrarse()">

                    <label>{{ $ctrl.t.repetirContrasena }}</label>
                    <input type="password" ng-model="$ctrl.registroData.repetirContrasena" placeholder="{{ $ctrl.t.placeholderContrasena }}" ng-keypress="$event.which === 13 && $ctrl.registrarse()">

                    <button class="btn-login" ng-click="$ctrl.registrarse()">
                        {{ $ctrl.t.crearCuenta }}
                    </button>

                    <button class="btn-login btn-registro" ng-click="$ctrl.mostrarLogin()">
                        {{ $ctrl.t.volverLogin }}
                    </button>

                </div>

            </div>
        </div>
    `,

    controller: function ($http) {
        var ctrl = this;

        ctrl.idiomaActual = localStorage.getItem("idiomaActual") || "es";
        ctrl.t = I18N[ctrl.idiomaActual];

        ctrl.loginVisible = false;
        ctrl.menuPerfilVisible = false;
        ctrl.modoRegistro = false;

        ctrl.registroData = {
            email: "",
            nickname: "",
            contrasena: "",
            repetirContrasena: ""
        };

        ctrl.loginData = {
            identificador: "",
            contrasena: ""
        };

        ctrl.mostrarRegistro = function () {
            ctrl.modoRegistro = true;
        };

        ctrl.mostrarLogin = function () {
            ctrl.modoRegistro = false;
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

        ctrl.registrarse = function () {

            if (!ctrl.registroData.email || !ctrl.registroData.nickname || !ctrl.registroData.contrasena || !ctrl.registroData.repetirContrasena) {
                alert("Todos los campos son obligatorios.");
                return;
            }

            if (ctrl.registroData.contrasena.length < 6) {
                alert("La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            if (ctrl.registroData.contrasena !== ctrl.registroData.repetirContrasena) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            var datosRegistro = {
                email: ctrl.registroData.email,
                nickname: ctrl.registroData.nickname,
                contrasena: ctrl.registroData.contrasena
            };

            $http.post("http://localhost:8085/api/usuarios/registro", datosRegistro)
                .then(function (response) {

                    ctrl.usuarioActual = response.data;

                    localStorage.setItem("usuarioActual", JSON.stringify(response.data));

                    ctrl.loginVisible = false;
                    ctrl.menuPerfilVisible = false;
                    ctrl.modoRegistro = false;

                    ctrl.registroData = {
                        email: "",
                        nickname: "",
                        contrasena: "",
                        repetirContrasena: ""
                    };

                })
                .catch(function (error) {
                    console.error("Error de registro:", error);

                    if (error.data && error.data.mensaje) {
                        alert(error.data.mensaje);
                    } else {
                        alert("No se pudo registrar el usuario.");
                    }
                });
        };

        ctrl.irPerfil = function () {
            window.location.href = "perfil.html";
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