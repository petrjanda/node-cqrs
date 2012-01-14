var couchRepository = require('../../lib/repository/couchRepository').getInstance();

couchRepository.database = 'bank';
couchRepository.setup();