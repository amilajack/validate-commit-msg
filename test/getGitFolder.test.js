'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var fs = require('fs');
var getGitFolder = require('../lib/getGitFolder');

describe('handle .git as folder', function() {
  before(function() {
    sinon.stub(fs, "existsSync", function() {
      return true;
    });
    sinon.stub(fs, "lstatSync", function() {
      return {
        isDirectory: function() {
          return true;
        }
      }
    });
  });

  it('should return ./.git when .git is a directory', function() {
    expect(getGitFolder()).to.be.equal('./.git');
  });

  after(function() {
    fs.existsSync.restore();
    fs.lstatSync.restore();
  });
});

describe('handle .git as file', function() {
  before(function() {
    sinon.stub(fs, "existsSync", function() {
      return true;
    });
    sinon.stub(fs, "lstatSync", function(location) {
      //Ensure that we say ./.git is a file, but ../../actual-folder is folder
      return {
        isDirectory: function() {
          return location != './.git';
        }
      }
    });
    sinon.stub(fs, 'readFileSync', function() {
      return 'gitdir: ../../actual-folder';
    });
  });

  it('should load gitdir from .git file', function() {
    expect(getGitFolder()).to.be.equal('../../actual-folder');
  });

  after(function() {
    fs.existsSync.restore();
    fs.lstatSync.restore();
    fs.readFileSync.restore();
  });
});

describe('handle .git does not exist', function() {
  before(function() {
    sinon.stub(fs, "existsSync", function() {
      return false;
    })
  });

  it('should throw error when ./.git is missing', function() {
    expect(getGitFolder).to.throw('Cannot find file ./.git');
  });

  after(function() {
    fs.existsSync.restore();
  });
});

describe('handle .git gitdir: folder does not exist', function() {
  before(function() {
    sinon.stub(fs, "existsSync", function(dir) {
      return './.git' == dir;
    });
    sinon.stub(fs, "lstatSync", function(location) {
      //Ensure that we say ./.git is a file, but ../../actual-folder is folder
      return {
        isDirectory: function() {
          return location != './.git';
        }
      }
    });
    sinon.stub(fs, 'readFileSync', function() {
      return 'gitdir: ../../actual-folder';
    })
  });

  it('should throw error when ./.git is missing', function() {
    expect(getGitFolder).to.throw('Cannot find file ../../actual-folder');
  });

  after(function() {
    fs.existsSync.restore();
    fs.lstatSync.restore();
    fs.readFileSync.restore();
  });
});
