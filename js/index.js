const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const dbName = "DELIVERY-DB";
const relationName = "SHIPMENT-TABLE";
const connToken = "90932110|-31949221938322076|90962079";

$(document).ready(function () {
  $("#shipmentNo").focus();

  $("#shipmentNo").on("change", getShipment);
  $("#saveBtn").click(saveData);
  $("#updateBtn").click(updateData);
  $("#resetBtn").click(resetData);
});

function getShipment() {
  const shipmentNo = $("#shipmentNo").val();
  if (!shipmentNo) {
    resetForm();
    return;
  }

  const getRequest = createGET_BY_KEYRequest(
    connToken,
    dbName,
    relationName,
    JSON.stringify({ id: shipmentNo })
  );
  jQuery.ajaxSetup({ async: false });
  const resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });

  if (resJsonObj.status === 200) {
    const recordData = JSON.parse(resJsonObj.data);
    localStorage.setItem("recno", recordData.rec_no);
    const data = recordData.record;
    fillForm(data);
    toggleFormFields(false, true, false, false);
    $("#shipmentNo").prop("disabled", true);
    $("#description").focus();
  } else {
    clearForm();
    toggleFormFields(false, false, true, false);
    $("#description").focus();
  }
}

function validateData() {
  let isValid = true;
  $("#shipmentForm input").each(function () {
    if (!$(this).val()) {
      alert(`${$(this).prev("label").text()} is required!`);
      $(this).focus();
      isValid = false;
      return false;
    }
  });
  return isValid;
}

function saveData() {
  if (!validateData()) return;

  const shipmentData = getFormData();

  const putRequest = createPUTRequest(
    connToken,
    JSON.stringify(shipmentData),
    dbName,
    relationName
  );
  jQuery.ajaxSetup({ async: false });
  const resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });

  if (resJsonObj.status === 200) {
    alert("Data saved successfully!");
    resetForm();
  } else {
    alert("Error saving data!");
  }
}

function updateData() {
  if (!validateData()) return;

  const shipmentData = getFormData();

  const updateRequest = createUPDATERecordRequest(
    connToken,
    JSON.stringify(shipmentData),
    dbName,
    relationName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  const resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });

  if (resJsonObj.status === 200) {
    alert("Data updated successfully!");
    resetForm();
  } else {
    alert("Error updating data!");
    console.log(updateRequest, resJsonObj);
  }
}

function resetData() {
  resetForm();
}

function resetForm() {
  $("#shipmentForm")[0].reset();
  toggleFormFields(true, true, true, true);
  $("#shipmentNo").focus();
}

function toggleFormFields(disableFields, disableSave, disableUpdate, disableReset) {
  $("#shipmentNo").prop("disabled", !disableFields);
  $("#description, #source, #destination, #shippingDate, #expectedDeliveryDate").prop("disabled", disableFields);
  $("#saveBtn").prop("disabled", disableSave);
  $("#updateBtn").prop("disabled", disableUpdate);
  $("#resetBtn").prop("disabled", disableReset);
}

function fillForm(data) {
  $("#description").val(data.description);
  $("#source").val(data.source);
  $("#destination").val(data.destination);
  $("#shippingDate").val(data.shippingDate);
  $("#expectedDeliveryDate").val(data.expectedDeliveryDate);
}

function clearForm() {
  $("#description, #source, #destination, #shippingDate, #expectedDeliveryDate").val("");
}

function getFormData() {
  return {
    id: $("#shipmentNo").val(),
    description: $("#description").val(),
    source: $("#source").val(),
    destination: $("#destination").val(),
    shippingDate: $("#shippingDate").val(),
    expectedDeliveryDate: $("#expectedDeliveryDate").val(),
  };
}