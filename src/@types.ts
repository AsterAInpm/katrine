
export enum HTTPRequestType {
  GET = "GET",
  POST = "POST"
};

export type ActionDescriptor = {
  route: string,
  actionMethod: string,
  requestType: HTTPRequestType
}
