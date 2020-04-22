# DB Connect + Migrations + Seeders con Sequelize en Express

> **⚠️ Disclaimer:** la presente guía da por entendido que tienes conocimientos intermedios en NODE, EXPRESS y SEQUELIZE. Sin dichos conocimientos, esta guía resultará algo confusa 🤯.

Al usar [sequelize](https://sequelize.org) dentro de un proyecto de NODE + EXPRESS es posible crear las tablas de la base de datos a través de migrations. Y así mismo popular dichas tablas con datos aleaotrios por medio de los seeders.

Este esquema de trabajo es altamente recomendado, pues al trabajar en equipo, nos podemos asegurar que cada integrante del mismo pueda contar con la misma estructura de datos en su DB.

---

## Temario
1. [sequelize-cli](#seq-cli)
2. [Inicialización del proyecto](#init)
3. [Creación del primer modelo y migration](#model-migrate)
4. [Estructura de un modelo](#model)
5. [Estructura de una migration](#migration)
6. [Corriendo nuestra primer migration](#db-migrate)
7. [Deshaciendo las migrations](#db-migrate-undo)
8. [Creando nuestro primer seeder](#seq-seed)
9. [Estructura del archivo seeder](#seeder)
10. [Corriendo los seeders](#db-seed)
11. [Comando útiles](#comands)
12. [Demo](app/)

---

## 1. sequelize-cli <a name="seq-cli"></a>
Lo primero que se debe tener listo es el comando `sequelize` habilitado en nuestra terminal. Para ello instalaremos dicho paquete de **npm** de manera global en nuestra máquina para tenerlo siempre a disposición.

```
npm install -g sequelize-cli
```

Para corroborar que se instalo efectivamente el paquete, escribiremos en la terminal ```sequelize``` a lo cual se deberá mostrar algo así:

```
Sequelize CLI [Node: 12.14.1, CLI: 5.5.1, ORM: 5.21.3]

sequelize [command]

Commands:
  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
  sequelize db:seed                           Run specified seeder
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file                       [aliases: migration:create]
  sequelize model:generate                    Generates a model and its migration                      [aliases: model:create]
  sequelize seed:generate                     Generates a new seed file
```

---

## 2. Inicialización del proyecto <a name="init"></a>
Ahora, inicializaremos las carpetas y archivos base que necesitamos para comenzar a trabajar. Para ello tomaremos el siguiente código:

```
const path = require('path');

module.exports = {
	config: path.resolve('./src/database/config', 'config.js'),
	'models-path': path.resolve('./src/database/models'),
	'seeders-path': path.resolve('./src/database/seeders'),
	'migrations-path': path.resolve('./src/database/migrations'),
};
```

Y guardaremos en mismo en un archivo llamado ```.sequelizrc```, el cual deberá estar ubicado en la raíz de nuestro proyecto de NODE + EXPRESS.

```
.
├── node_modules
├── public
├── src
│   ├── app.js
│   └── etc...
├── .sequelizerc ← ¡Archivo Necesario!
├── package.json
└── ...
```

Con dicho archivo listo, podremos ejecutar en la terminal el siguiente comando:

```
sequelize init
```

Este comando creará dentro de la carpeta `/src` una sub-carpeta llamada `/database`, la cual tendrá la siguiente estructura:

```
.
├── src
│   ├── app.js
│   └── database
│       └── config
│           └── config.js
│       └── migrations
│       └── models
│           └── index.js
│       └── seeders
├── .sequelizerc
└── ...
```

Entendiendo que las carpetas **migrations** y **seeders** estarán vacías. Dentro del archivo `config.js` la estructura del mismo deberá configurarse así:

```js
module.exports = {
  "development": {
    "username": DB_USER, // ← Usuario de la DB
    "password": DB_PASS, // ← Contraseña del usuario de la DB
    "database": DB_NAME, // ← Nombre de la DB previamente creada
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

Si hasta aquí todo salió bien, con estos pasos ya tendremos conexión a nuestra base de datos.

---

## 3. Creación del primer modelo (y su respectiva migration) <a name="model-migrate"></a>
Al crear un modelo con la terminal, `sequelize` creará a su vez la correspondiente *migration* del mismo. 

Para crear un modelo basta con ejecutar en la terminal el siguiente comando:

```
sequelize model:generate --name User --attributes firstName:string,lastName:string
```

Deshilvanemos el mismo para entenderlo un poco más a fondo:

* `model:generate`: indica a `sequelize` que deberá crear un modelo y su respectiva *migration*.
* `--name User`: creará el modelo `user.js` dentro de la carpeta `/database/models` y la *migration* para crear la tabla `Users` dentro de la carpeta `/database/migrations`. El nombre del archivo de migración tendrá un *timestamp* y el texto *create-user*, se verá algo así: `20200420214736-create-user.js`.
* `--attributes`: permite definir las columnas de la tabla y atributos del modelo. No es necesario definir todas las columnas/atributos, pues las mismas se podrán especificar una vez los archivos estén creados.

Con esto hecho, la estructura de archivos dentro de la carpeta `/database` deberá verse algo así:

```
.
├── database
│   └── config
│       └── config.js
│   └── migrations
│       └── 20200420214736-create-user.js
│   └── models
│       └── index.js
│       └── user.js
│   └── seeders
└── ...
```

## 4. Estructura del modelo <a name="model"></a>
Como bien es sabido, un modelo es la representación que el ORM tiene de una tabla en la base de datos. Generalmente un modelo se ve de la siguiente manera:

```js
'use strict';
module.exports = (sequelize, DataTypes) => {
   const User = sequelize.define('User', {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
   }, {});

   User.associate = function(models) {
      // associations can be defined here
   };

   return User;
};
```

En este caso, dentro de éste archivo lo único que se debe definir son las columnas que se desean obtener de la tabla (*la columna id no es necesaria, viene implícita*), pues las mismas quedarán disponibles para lectura y escritura. Cualquier columna existente en la tabla y no referenciada en el modelo será ignorada.

---

## 5. Estructura de la migration <a name="migration"></a>

Tras haber ejecutado el comando:

```
sequelize model:generate --name User --attributes firstName:string,lastName:string
```

El archivo de la *migration* se verá así:

```js
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
```

Como se puede apreciar el objeto literal que se está exportando, contiene dós métodos: `up` y 	`down`. Los cuales permiten:

* `up`: crear la tabla al correr la *migration*.
* `down`: eliminar la tabla si se desea deshacer la *migration*.

Generalment el método `down` **no** se debe tocar. Mientras que en el método `up` es donde vamos a crear todas las columnas que deseamos tenga esa tabla.

En primera medida, `sequelize` nos da las columnas solicitadas `firstName` y `lastName`. Y por otro lado genera de manera implícita las columnas `id`, `createdAt` y `updatedAt`.

Si se desearan agregar las columnas `email` y `deletedAt`, es tan simple como agregar las mismas al listado de atributos.
 
```js
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      // Columna agregada a mano en el archivo
      email: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      // Columna agregada a mano en el archivo
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
```

> ⚠️ **Warning**: cualquier columna aquí agregada, deberá agregarse también en el modelo para tener acceso de lectura / escritura a la misma. De igual forma, las columnas `createdAt`, `updatedAt` y `deletedAd` no se hace necesario especificarlas en el modelo, pues las mismas ya vienen implícitas.

---

## 6. Corriendo nuestra primer migration <a name="db-migrate"></a>
Con el archivo de migración listo, ahora no nos queda otra cosa más que correr el mismo.

Para ello, desde la terminal ejecutaremos el siguiente comando:

```
sequelize db:migrate
```

El anterior comando ejecutará la migración, es decir, creará la tabla correspondiente en la base de datos y adicionalmente, la 1er vez que se ejecute una migración, se creará una tabla llamada `SequelizeMeta` la cual guardará un registro de cada una de las migraciones corridas.

---

## 7. Deshaciendo las migrations <a name="db-migrate-undo"></a>

Si por algún motivo quisieramos revertir el proceso de la migración, llevar a cabo esto es totalmente posible, pues para ello podremos ejecutar el comando:

```
sequelize db:migrate:undo
```

> Dicho comando, revertirá la última migración realizada.

Si nuestro objetivo es revertir **todas** las migraciones, el comando a ejecutar en la terminal será:

```
sequelize db:migrate:undo:all
```

Pero si quisieramos revertir a una *migration* en específico, podríamos ejecutar este comando:

```
sequelize db:migrate:undo --to XXXXXXXXXXXXXX-create-TABLE.js
```

--- 

## 8. Creando nuestro primer seeder <a name="seq-seed"></a>

Un archivo *seeder* básicamente servirá para poder popular las tablas de nuestra base de datos con información *ficticia*.

Para crear nuestro primer *seeder* tendremos que ejecutar el siguiente comando en la terminal:

```
sequelize seed:generate --name demo-user
```

* `seed:generate`: indica a `sequelize` que deberá crear un archivo seeder.
* `--name`: indica el nombre que tendrá el archivo seeder.
* `demo-user`: será el nombre del archivo seeder. Dentro de la carpeta `/seeders/` se creará un archivo con el siguiente nombre `20200420215532-demo-user.js`. (como se puede observar, el nombre del archivo también tiene presente el *timestamp*).

---

## 9. Estructura del archivo seeder <a name="seeder"></a>

Un archivo seeder se verá de la siguiente manera:

```js
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
        firstName: 'John',
        lastName: 'Doe',
        email: 'demo@demo.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
```

Cómo se puede ver, este archivo también tiene presente dos métodos: `up` y `down`.

* `up`: definé lo que sucederá al momento de ejecutar el archivo seeder.
* `down`: definé lo que sucederá si se quiere revertir el seed realizado.

Dentro del método `up` lo más importante sucede en el segundo parámetro del método `bulkInsert`. Pues el mismo deberá ser un array de objetos literales, los cuales serán los datos que se insertarán en la tabla.

> ⚠️ **Disclaimer**: Cada objeto literal del array deberá tener la misma estructura de atributos del modelo creado previamente.


## 10. Corriendo los seeders <a name="db-seed"></a>

Para poder correr los seeders y popular nuestras tablas con información, deberemos ejecutar el siguiente comando:

```
sequelize db:seed:all
```

Si quisieramos revertir la migración más reciente, podríamos ejecutar:

```
sequelize db:seed:undo
```

Y si quisieramos revertir todas migraciones realizadas, podríamos ejecutar:

```
sequelize db:seed:undo:all
```

---

## 11. Comándos útiles <a name="comands"></a>

* `sequelize init`: creará las carpeta y archivos necesarios.
* `sequelize model:generate`: creará el modelo y la respectiva migración.
* `sequelize db:migrate`: correrá las migraciones pendientes.
* `sequelize db:migrate:status`: mostrará las migraciones ejecutadas.
* `sequelize db:migrate:undo`: revertirá la última migración ejecutadas.
* `sequelize db:migrate:undo:all`: revertirá todas las migraciones ejecutadas.
* `sequelize seed:generate`: creará el seeder de datos *fake*.
* `sequelize db:seed`: correrá los seeders pendientes.
* `sequelize db:seed:all`: correrá todos seeders.
* `sequelize db:seed:undo`: revertirá el último seeder que se ejecutó.
* `sequelize db:seed:undo:all`: revertirá todos los seeders ejecutados.
* `sequelize db:seed:undo:all`: revertirá todos los seeders ejecutados.
* `sequelize migration:generate`: generará un archivo *custom* de migración (Ej: `ALTER TABLE`).

---

**Made with ❤️ by: [Javi Herrera](https://javier-herrera.com)**

*Si te parece interesante este tipo de contenido, puedes agradecerme con un Follow en mis siguientes redes sociales. Lo estimaría un montón.*

[![icon linkedin](docs/icon-linkedin.png)](https://www.linkedin.com/in/japsolo/)
[![icon instagram](docs/icon-instagram.png)](https://www.instagram.com/thefullstackdevs/)
[![icon spotify](docs/icon-spotify.png)](https://open.spotify.com/show/3J2dLuBSfzt9VVnEF8q18a)