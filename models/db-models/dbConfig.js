var config = require("../../config");
var Sequelize = require("sequelize");

var username = config.authentication.postgres.username;
var password = config.authentication.postgres.password;
var uri, dbname;

if (config.stage == "development") {
  uri = config.postgres.development.server.uri;
  dbname = config.postgres.development.database;
}

var sequelize;

// Uses heroku database
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    host: uri,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    protocol: 'postgres',
  });
// database is localhost
} else {
  sequelize = new Sequelize(dbname, username, password, {
    host: uri,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    protocol: 'postgres',
  });
}

var Kek = sequelize.define('kek', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  value: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  tableName: config.postgres.keksTable,
  timestamps: false
})


var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
    field: 'kmetName',
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'kmetSurname',
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    field: 'kmetUsername',
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    field: 'kmetEmail',
    allowNull: false
  },
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  password: {
    type: Sequelize.STRING,
    field: 'kmetPassword',
    allowNull: false
  }
}, {
  tableName: config.postgres.usersTable,
  timestamps: false
});

var Task = sequelize.define('task', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT
  },
  date: {
    field: "taskDate",
    type: Sequelize.DATE
  },
  name: {
    field: "taskName",
    type: Sequelize.STRING
  },
  taskType: {
    field: "taskType",
    type: Sequelize.STRING
  },
  taskResource: {
    type: Sequelize.STRING,
    field: "taskTypeResource"
  },
  description: {
    type: Sequelize.STRING,
    field: "taskDescription"
  },
  userId: {
    type: Sequelize.BIGINT,
    references: {
      model: User,
      key: "id"
    }
  }
}, {
  tableName: "tasks",
  timestamps: false
})

var Animal = sequelize.define('animal', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT
  },
  birthdate: {
    field: "animalBirth",
    type: Sequelize.DATE
  },
  name: {
    field: "animalName",
    type: Sequelize.STRING
  },
  alive: {
    field: "animalActive",
    type: Sequelize.BOOLEAN
  },
  description: {
    type: Sequelize.STRING,
    field: "animalDescription"
  },
  userId: {
    type: Sequelize.BIGINT,
    references: {
      model: User,
      key: "id"
    }
  }
}, {
  tableName: "animals",
  timestamps: false
})

var Property = sequelize.define('property', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT
  },
  gerk: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING,
    field: "propertyName"
  },
  description: {
    type: Sequelize.STRING,
    field: "propertyDescription"
  },
  userId: {
    type: Sequelize.BIGINT,
    references: {
      model: User,
      key: "id"
    }
  }
}, {
  tableName: "properties",
  timestamps: false
})

User.hasMany(Task);
User.hasMany(Animal);
User.hasMany(Property);

module.exports = {
  sequelize: sequelize,
  config: config,
  User: User,
  Kek: Kek,
  Task: Task,
  Animal: Animal,
  Property: Property
}
