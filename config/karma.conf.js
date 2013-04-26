basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'javascripts/lib/angular/angular.js',
  'javascripts/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
