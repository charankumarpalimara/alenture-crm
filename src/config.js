export const apiUrl = "http://147.182.163.213:3000";


export function getCrmId() {
  const userDetails = JSON.parse(sessionStorage.getItem('CrmDetails')) || {};
  return userDetails.crmid || '';

}

export function getCrmName() {
  const userDetails = JSON.parse(sessionStorage.getItem('CrmDetails')) || {};
  return userDetails.firstname + " " + userDetails.lastname || '';
}


export function getCreaterRole() {
  const userDetails = JSON.parse(sessionStorage.getItem('CrmDetails')) || {};
  return userDetails.extraind10 ||'';
}


export function getCrmEmail() {
  const userDetails = JSON.parse(sessionStorage.getItem('CrmDetails')) || {};
  return userDetails.email || '';
}