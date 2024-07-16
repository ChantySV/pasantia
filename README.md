# Repositorio de Documentos - README

Este repositorio de documentos es una aplicación web diseñada para gestionar y mostrar documentos académicos. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los documentos almacenados en un servidor.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

- Node.js: Asegúrate de tener Node.js instalado. Puedes descargarlo desde [nodejs.org](https://nodejs.org).
- Navegador Web: Para visualizar la aplicación, necesitarás un navegador web moderno como Google Chrome, Mozilla Firefox, Safari, etc.
- Servidor de Backend: Necesitarás un servidor de backend que maneje las peticiones HTTP para la API REST que la aplicación consume. Esto puede ser implementado usando tecnologías como Node.js, Python (Django o Flask), Ruby on Rails, etc.
- MySQL: Para que las peticiones funcionen correctamente

## Configuración
1. Instalar Dependencias: Instala las dependencias necesarias usando npm (Node Package Manager). Ejecuta el siguiente comando en la raíz del proyecto:
   
   npm install(para los paquetes json) 
   npm run setup (Ejecutara las creara la base de datos y ejecutrara las migraciones)
   

## Configuración del Servidor Backend

1. Configurar el Servidor Backend: Configura y asegúrate de tener el servidor backend correctamente configurado y ejecutándose en `http://localhost:5000` (por ejemplo).

2. Configurar la API: Asegúrate de que la API del servidor backend esté configurada para manejar las rutas y métodos de la siguiente manera:

   - `GET /documentos`: Para obtener todos los documentos.
   - `POST /documentos`: Para crear un nuevo documento.
   - `PUT /documentos/put/:id_documento`: Para actualizar un documento existente.
   - `DELETE /documentos/delete/:id_documento`: Para eliminar un documento existente.

   Asegúrate de que la API responda correctamente a estas peticiones antes de continuar.

## Ejecución de la Aplicación

Una vez que hayas clonado el repositorio y configurado el servidor backend, puedes ejecutar la aplicación web:

1. Iniciar la Aplicación: Ejecuta el siguiente comando en la raíz del proyecto para iniciar la aplicación:

   npm run start

   Esto iniciará un servidor de desarrollo y abrirá automáticamente la aplicación en tu navegador predeterminado.

2. Usar la Aplicación: Una vez que la aplicación esté cargada en tu navegador, podrás realizar las siguientes operaciones:

   - Crear Documentos: Utiliza el formulario de creación para añadir nuevos documentos.
   - Editar Documentos: Puedes modificar los documentos existentes haciendo clic en el botón "Modificar" y guardando los cambios.
   - Eliminar Documentos: Elimina documentos haciendo clic en el botón "Eliminar" después de confirmar la acción.
   - Ver Documentos: Haz clic en el botón "Abrir" para abrir el documento PDF en una nueva pestaña del navegador.