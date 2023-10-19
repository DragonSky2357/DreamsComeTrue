interface ResponseSucess {
  statusCode: number;
  data?: any;
}

interface ResponseFailed {
  statusCode: number;
  message?: string;
}

export type ResponseResult = ResponseSucess | ResponseFailed;
