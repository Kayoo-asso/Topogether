/* Replace with your SQL commands */


CREATE TYPE Role as ENUM('USER', 'ADMIN');

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role Role
);

CREATE TYPE Grade AS ENUM(
    '3',
    '3+',
    '4',
    '4+',
    '5a',
    '5a+',
    '5b',
    '5b+',
    '5c',
    '5c+',
    '6a',
    '6a+',
    '6b',
    '6b+',
    '6c',
    '6c+',
    '7a',
    '7a+',
    '7b',
    '7b+',
    '7c',
    '7c+',
    '8a',
    '8a+',
    '8b',
    '8b+',
    '8c',
    '8c+',
    '9a',
    '9a+',
    '9b',
    '9b+',
    '9c',
    '9c+'
);

CREATE TYPE Rating as ENUM('1', '2', '3', '4', '5');

CREATE TYPE TopoStatus as ENUM('Draft', 'Submitted', 'Validated');

CREATE TYPE TopoType AS ENUM('Boulder', 'Cliff', 'Deep water', 'Multi-pitch', 'Artificial');

CREATE TYPE Orientation AS ENUM('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW');

CREATE TYPE Terrain as ENUM('Good', 'OK', 'Bad', 'Dangerous');


CREATE TYPE RockType AS ENUM(
    'Andesite',
    'Basalt',
    'Composite',
    'Conglomerate',
    'Chalk',
    'Dolerite',
    'Gabbro',
    'Gneiss',
    'Granite',
    'Gritstone',
    'Limestone'
    'Migmatite',
    'Molasse',
    'Porphyre',
    'Quartz',
    'Quartzite',
    'Rhyolite',
    'Sandstone',
    'Schist',
    'Serpentine',
    'Trachyandesite',
    'Trachyte',
    'Tuff',
    'Volcanic',
);