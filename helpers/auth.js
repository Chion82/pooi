import { DMM_TOKEN_REGEXP, TOKEN_REGEXP, SESID_REGEXP, OSAPI_URL_REGEXP,
  USER_AGENT, LOGIN_URL, AJAX_TOKEN_URL, AUTH_URL, GAME_URL, MAKE_REQUEST_URL,
  GET_WORLD_URL, GET_FLASH_URL, FLASH_URL, WORLD_IP } from '../config/const';
import _ from 'lodash';
import url from 'url';
import qs from 'querystring';
import { vsprintf } from 'sprintf';
import request from 'request';
import Promise from 'bluebird';
Promise.promisifyAll(request);

// Get DMM token
async function getDMMToken(username, password, headers) {
  try {
    let [response, data] = await request.getAsync({
      url: LOGIN_URL,
      headers
    });
    let dmmToken = DMM_TOKEN_REGEXP.exec(data)[1];
    let token = TOKEN_REGEXP.exec(data)[1];
    return {
      DMM_TOKEN: dmmToken,
      TOKEN: token
    };
  } catch (e) {
    return {
      ERROR: 1,
      MESSAGE: e.message
    }
  }
}

// Get AJAX token
async function getAJAXToken(username, password, headers, info) {
  try {
    _.assign(headers, {
      'Origin': 'https://www.dmm.com',
      'Referer': LOGIN_URL,
      'Cookie': 'ckcy=1; check_open_login=1; check_down_login=1',
      'DMM_TOKEN': info.DMM_TOKEN,
      'X-Requested-With': 'XMLHttpRequest'
    });
    let [response, data] = await request.postAsync({
      url: AJAX_TOKEN_URL,
      form: {
        token: info.TOKEN
      },
      headers,
      json: true
    });
    return {
      AJAX_TOKEN: data.token,
      LOGIN_ID_KEY: data.login_id,
      PASSWORD_KEY: data.password
    };
  } catch (e) {
    return {
      ERROR: 2,
      MESSAGE: e.message
    }
  }
}

// Get Session
async function getSessionID(username, password, headers, info) {
  delete headers['DMM_TOKEN'];
  delete headers['X-Requested-With'];
  try {
    let form = {
      login_id: username,
      password: password,
      token: info.AJAX_TOKEN
    };
    form[info.LOGIN_ID_KEY] = username;
    form[info.PASSWORD_KEY] = password;
    let [response, data] = await request.postAsync({
      url: AUTH_URL,
      form: form,
      headers: headers,
      followRedirect: false
    });
    let sesid = null;
    if (response.headers['set-cookie']) {
      for (let cookie of response.headers['set-cookie']) {
        sesid = SESID_REGEXP.exec(cookie);
        if (sesid) {
          sesid = sesid[1];
          break;
        }
      }
    }
    if (!sesid)
      throw new Error('Fetch session id error');
    return {
      STATUS_CODE: response.statusCode,
      SESSION_ID: sesid
    };
  } catch (e) {
    return {
      ERROR: 3,
      MESSAGE: e.message
    };
  }
}

async function getOSAPIURL(username, password, headers, info) {
  try {
    _.assign(headers, {
      'Cookie': `ckcy=1; check_open_login=1; check_down_login=1; INT_SESID=${info.SESSION_ID}`,
      'Referer': AUTH_URL
    });
    let [response, data] = await request.getAsync({
      url: GAME_URL,
      headers
    });
    let osapiURL = OSAPI_URL_REGEXP.exec(data)[1];
    return {
      OSAPI_URL: osapiURL
    };
  } catch (e) {
    return {
      ERROR: 4,
      MESSAGE: e.message
    };
  }
}

async function getWorldURL(username, password, headers, info) {
  try {
    _.assign(headers, {
      'Referer': info.OSAPI_URL
    });
    let query = qs.parse(url.parse(info.OSAPI_URL).query);
    let reqURL = vsprintf(GET_WORLD_URL, [query.owner, Date.now()]);
    console.log(reqURL);
    let [response, data] = await request.getAsync({
      url: reqURL,
      headers
    });
    if (data.startsWith('svdata=')) {
      data = JSON.parse(data.substring(7));
      if (data.api_result != 1)
        throw new Error('Unexpected response');
      return {
        WORLD_IP: WORLD_IP[data.api_data.api_world_id],
        OWNER: query.owner,
        ST: query.st
      };
    } else {
      throw new Error('Unexpected response');
    }
  } catch (e) {
    return {
      ERROR: 5,
      MESSAGE: e.message
    }
  }
}

async function getAPIToken(username, password, headers, info) {
  try {
    let flashURL = vsprintf(GET_FLASH_URL,
                            [info.WORLD_IP, info.OWNER, Date.now()]);
    let [response, data] = await request.postAsync({
      url: MAKE_REQUEST_URL,
      headers,
      form: {
        url: flashURL,
        httpMethod: 'GET',
        authz: 'signed',
        st: info.ST,
        contentType: 'JSON',
        numEntries: '3',
        getSummaries: 'false',
        signOwner: 'true',
        signViewer: 'true',
        gadget: 'http://203.104.209.7/gadget.xml',
        container: 'dmm'
      }
    });
    data = JSON.parse(data.substring(27));
    console.log(data);
    if (data[flashURL].rc != 200)
      throw new Error('Unexpected response');
    data = JSON.parse(data[flashURL].body.substring(7));
    if (data.api_result != 1)
      throw new Error('Unexpected response');
    return {
      API_TOKEN: data.api_token,
      API_STARTTIME: data.api_starttime
    };
  } catch (e) {
    return {
      ERROR: 6,
      MESSAGE: e.message
    }
  }
}

async function getFlash(username, password, headers, info) {
  return {
    FLASH_URL: vsprintf(FLASH_URL,
                        [info.WORLD_IP, info.API_TOKEN, info.API_STARTTIME])
  };
}

async function auth(username, password) {
  let info = {};
  let headers = { 'User-Agent': USER_AGENT };
  let steps = [getDMMToken, getAJAXToken, getSessionID, getOSAPIURL,
              getWorldURL, getAPIToken, getFlash];
  for (let step of steps) {
    _.assign(info, await step(username, password, headers, info));
    if (info.ERROR)
      return { headers, info };
  }
  return { headers, info };
}

export default auth;
