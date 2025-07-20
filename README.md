# Chat Moderno – Backend

¡Hola! Soy César Romero y este es el backend Express que conecta mi app de chat con Vertex AI (el motor de respuestas). Acá te cuento cómo va el tema de las credenciales, la seguridad y cómo levantar el server sin dramas.

---

## ¿Qué credencial uso acá?

Acá sí o sí necesito el **archivo JSON de Service Account** que te da Google Cloud. Este archivo es privado, no lo subas al repo ni lo compartas. Solo el backend lo usa para autenticarse con Vertex AI.

### ¿Por qué no uso el OAuth Client ID?
Porque el backend no hace login de usuario, solo necesita permiso para hablar con Vertex AI. El OAuth Client ID es para el frontend, para login de usuario.

---

## 🛠️ ¿Cómo lo uso en el código?

Antes de levantar el servidor, me aseguro de que la variable de entorno apunte al archivo JSON:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="./google-vertex-service-account.json"
```

O en el código:

```js
process.env.GOOGLE_APPLICATION_CREDENTIALS = './google-vertex-service-account.json';
```

Después, uso la librería oficial de Vertex AI para Node.js y listo.

---

## ¿Cómo lo corro?

1. Poné el archivo `google-vertex-service-account.json` en la raíz del backend (no lo subas al repo).
2. Instalá dependencias:
   ```
   npm install
   ```
3. Levantá el server:
   ```
   node server.js
   ```
4. El backend escucha en el puerto que le pongas (por defecto, 3000).

---

## ¿Cómo es el flujo?

- El frontend pide login a Google (con OAuth Client ID).
- El usuario se loguea, y la app manda los mensajes al backend.
- El backend usa la Service Account para hablar con Vertex AI y devuelve la respuesta al frontend.

---

## ⚠️ Variables de entorno y credenciales

- No subas nunca tus credenciales reales ni archivos `.env` al repo.
- Usá el archivo `.env.example` como plantilla y completá tus datos localmente.
- Para desarrollo, podés usar los clientId de testing de Expo (son públicos y seguros para pruebas, pero no para producción).
- En producción, cada ambiente debe definir sus propias variables de entorno.

---



