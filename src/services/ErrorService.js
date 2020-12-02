const GetErrorMessage = (errorCode) => {
  let errorMessage = '';
  switch (errorCode) {
    case 404:
      errorMessage = "Sorry, we can't seem to find what you are looking for.";
      break;
    case 401:
      errorMessage = 'Sorry, you do not have permission to view this page.';
      break;
    default:
      errorMessage = 'Sorry, something went wrong in our side. Please try again later.';
  }

  return errorMessage;
};

export default GetErrorMessage;
