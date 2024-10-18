import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

// Import CryptoJS as a script
const cryptoJsScript = document.createElement('script');
cryptoJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
document.head.appendChild(cryptoJsScript);

// Wait for CryptoJS to load before proceeding
cryptoJsScript.onload = () => {
  // Obfuscated decryption function and sensitive data
  const _0x5a2b=['UmVkbGluZQ==','VTJGc2RHVmtYMTl0TmxENXp6Q1dSM1F0RTFJbHN0U3o0ZVU2ckI4aWZIb2s4NFVsZnZHNlhOT2tMY1huUEdHSlFIY0FOS0lVSmJaNVV2OVdJOUVvS20xcXNFQm11K1Q3dTkwMnY5VS9mTG05MVB5b0s3K0pETFY2VnN5OW5WYWNhVWlGakRiMUt5K3BxQkpoQ212Nmo2NkZWVjVwSlA5TVBQLz==','ZGVjcnlwdA==','QUVT','cGFyc2U=','dG9TdHJpbmc=','VXRmOA=='];(function(_0x4d5718,_0x5a2b8f){const _0x44e226=function(_0x43dc30){while(--_0x43dc30){_0x4d5718['push'](_0x4d5718['shift']());}};_0x44e226(++_0x5a2b8f);}(_0x5a2b,0x1d3));const _0x44e2=function(_0x4d5718,_0x5a2b8f){_0x4d5718=_0x4d5718-0x0;let _0x44e226=_0x5a2b[_0x4d5718];if(_0x44e2['INrDNH']===undefined){(function(){const _0x43dc30=function(){let _0x5e4f0c;try{_0x5e4f0c=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x2a9c92){_0x5e4f0c=window;}return _0x5e4f0c;};const _0x5887a7=_0x43dc30();const _0x13f30e='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x5887a7['atob']||(_0x5887a7['atob']=function(_0x292610){const _0x106259=String(_0x292610)['replace'](/=+$/,'');let _0x12fd4d='';for(let _0x13ea9a=0x0,_0x48d09b,_0x1b4c0b,_0x2cd92f=0x0;_0x1b4c0b=_0x106259['charAt'](_0x2cd92f++);~_0x1b4c0b&&(_0x48d09b=_0x13ea9a%0x4?_0x48d09b*0x40+_0x1b4c0b:_0x1b4c0b,_0x13ea9a++%0x4)?_0x12fd4d+=String['fromCharCode'](0xff&_0x48d09b>>(-0x2*_0x13ea9a&0x6)):0x0){_0x1b4c0b=_0x13f30e['indexOf'](_0x1b4c0b);}return _0x12fd4d;});}());_0x44e2['csWDXF']=function(_0x1e3e21){const _0x595c2c=atob(_0x1e3e21);let _0x3a51ce=[];for(let _0x150e1b=0x0,_0x47961e=_0x595c2c['length'];_0x150e1b<_0x47961e;_0x150e1b++){_0x3a51ce+='%'+('00'+_0x595c2c['charCodeAt'](_0x150e1b)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3a51ce);};_0x44e2['gNnULi']={};_0x44e2['INrDNH']=!![];}const _0x43dc30=_0x44e2['gNnULi'][_0x4d5718];if(_0x43dc30===undefined){_0x44e226=_0x44e2['csWDXF'](_0x44e226);_0x44e2['gNnULi'][_0x4d5718]=_0x44e226;}else{_0x44e226=_0x43dc30;}return _0x44e226;};const _0x43dc30=atob(_0x44e2('0x0'));const _0x5e4f0c=atob(_0x44e2('0x1'));function _0x2a9c92(_0x5887a7,_0x13f30e){const _0x292610=CryptoJS[_0x44e2('0x3')][_0x44e2('0x2')](_0x5887a7,_0x13f30e);return JSON[_0x44e2('0x4')](_0x292610[_0x44e2('0x5')](CryptoJS[_0x44e2('0x6')][_0x44e2('0x7')]));}

  // Decrypt the Firebase configuration
  const firebaseConfig = _0x2a9c92(_0x5e4f0c, _0x43dc30);

  // Initialize Firebase
  const webApp = initializeApp(firebaseConfig);
  const authentication = getAuth(webApp);

  // Set up Google Sign-In
  document.getElementById('GoogleLogin').addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    signInWithPopup(authentication, provider)
      .then((result) => {
        console.log('User signed in:', result.user);
        window.location.href = 'chat_page.html';
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
      });
  });

  // Check if user is already signed in
  onAuthStateChanged(authentication, (user) => {
    if(user){
      console.log('The user is signed in to another device.');
      window.location.href = 'chat_page.html';
    }
  });
};