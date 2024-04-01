export class AppConfig {
    public static HTTP_HOST : string = "localhost";
    public static HTTP_PORT :string = "9180";
    public static HTTP_CONTEXT :string  = "sirms";

    public static COOKIE_KEY : string = "appCurrentUser" ;

    public static BASE_URL:string  =  "http://" + AppConfig.HTTP_HOST + ":" + AppConfig.HTTP_PORT + "/" + AppConfig.HTTP_CONTEXT;

    public static RESEARCHER_WEB_BASE:string = "http://localhost/web_investigador"
    public static RESEARCHER_WEB_EDITOR_URL:string = AppConfig.RESEARCHER_WEB_BASE + "/editor";
    public static RESEARCHER_WEB_URL:string = AppConfig.RESEARCHER_WEB_BASE + "/p";
}