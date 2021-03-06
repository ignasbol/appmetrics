/*******************************************************************************
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/

var global = false;
process.argv.forEach(function(elem) {
  if (elem == '-g')
    global = true;
});

var agent;
if (!global)
{
  agent = require('appmetrics');
  agent.start();

  // Make agent visible for other script files.
  module.exports.agent = agent;
  require('./api_tests');
}

// Set how long the tests will run for. Default: 30s.
var duration_secs = process.argv[2] || 30;

var t = null;
var ih = setInterval(function() {
  var dummy = new Buffer(1024*1024);
  dummy.write("hello");
  t = dummy.toString()[0];
}, 100);

if (duration_secs != null)
{
  setTimeout(function() {
    clearInterval(ih);
    if (agent) {
      agent.stop();
      setTimeout(function() {}, 500);
    }
  }, duration_secs*1000);
}
