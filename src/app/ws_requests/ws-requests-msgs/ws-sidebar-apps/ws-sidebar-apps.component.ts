import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LoggerService } from 'app/services/logger/logger.service';
import { slideInOutAnimationNoBckgrnd } from '../../../_animations/index';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AppStoreService } from 'app/services/app-store.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'app/core/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'appdashboard-ws-sidebar-apps',
  templateUrl: './ws-sidebar-apps.component.html',
  styleUrls: ['./ws-sidebar-apps.component.scss'],
  animations: [slideInOutAnimationNoBckgrnd],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@slideInOutAnimationNoBckgrnd]': '' }
})
export class WsSidebarAppsComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild('navbarBrand')
  private appsSidebar: ElementRef;

  @Output() valueChange = new EventEmitter();
  isOpenRightSidebar: boolean = true;
  SIDEBAR_APPS_IN_CHAT_PANEL_MODE: boolean;
  projectId: string;
  @Input() request: string;
  // for TEST
  // apps = [ { 'src': "https://fakecrm.nicolan74.repl.co", iframeHeight: 200 }]
  apps: any;
  dashboardApps: any;
  webchatApps: any
  subscription: Subscription;
  REQUEST_HAS_CHANGED: boolean;
  current_value: any;
  previous_value: any;
  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private logger: LoggerService,
    private translate: TranslateService,
    public router: Router,
    public appStoreService: AppStoreService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.getIfRouteUrlIsRequestForPanel();
    this.getCurrentProject();
    // this.getApps()
    this.getInstallationsPopulateWithApp()

  }

  ngAfterViewInit() {
    // this.subscribeToHasOpenAppsSidebar()
  }

  ngOnDestroy() {
    this.logger.log('[WS-SIDEBAR-APPS] ngOnDestroy')
    this.subscription.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  getCurrentProject() {
    this.subscription = this.auth.project_bs.subscribe((project) => {
      if (project) {
        this.projectId = project._id
        this.logger.log('[WS-SIDEBAR-APPS] - projectId ', this.projectId)
      }
    });
  }

  subscribeToHasOpenAppsSidebar() {
    this.appStoreService.hasOpenAppsSidebar$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((hasopen: boolean) => {
        this.logger.log('[WS-SIDEBAR-APPS] - HAS OPEN RIGHT SIDEBAR ', hasopen);
        // setTimeout(() => {
        //   const apps_sidebar_header = <HTMLElement>document.querySelector('apps-sidebar-header');
        //   console.log('[WS-SIDEBAR-APPS] - HAS OPEN RIGHT SIDEBAR - apps_sidebar_header ', apps_sidebar_header)
        // }, 4000);
        // this.logger.log('[WS-SIDEBAR-APPS] - HAS OPEN RIGHT SIDEBAR - appsSidebar 1', this.appsSidebar)

        // console.log('[WS-SIDEBAR-APPS] - HAS OPEN RIGHT SIDEBAR - window',window)

        // document.addEventListener('scroll', function(e) {
        //   console.log('scroll  e ', e) 

        // })
        // console.log('[WS-SIDEBAR-APPS] - HAS OPEN RIGHT SIDEBAR - window',window.scroll(0,0))
        // window.scrollTo(0,0)
        // document.body.scrollTop = 0;

        //  const body = document.querySelector('body')
        //  console.log('[WS-SIDEBAR-APPS] - HAS OPEN RIGHT SIDEBAR - body',body)
        //  body.scrollTo(0,0)
        // window.scrollBy(0,-1000)
        //  window.addEventListener("scroll", function(){  console.log('scrollY', this.scrollY)  })
        // window.parent.parent.scrollTo(0,0)
        // window.scrollTo({
        //   top: 0,
        //   left: 0,
        //   behavior: 'smooth'
        // });
        // setTimeout(() => {

        //     console.log('[WS-SIDEBAR-APPS] - HAS OPEN RIGHT SIDEBAR - appsSidebar 2', this.appsSidebar)
        //     this.appsSidebar.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

        // }, 2000);

      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logger.log('[WS-SIDEBAR-APPS] request', this.request)

    this.logger.log('[WS-SIDEBAR-APPS] request changes', changes)
    this.logger.log('[WS-SIDEBAR-APPS] request changes firstChange', changes.request.firstChange)
    if (changes.request.firstChange === false && changes.request.currentValue && changes.request.previousValue) {

      this.logger.log('[WS-SIDEBAR-APPS] request changes request currentValue', changes.request.currentValue)
      this.logger.log('[WS-SIDEBAR-APPS] request changes request previousValue', changes.request.previousValue)
      this.current_value = changes.request.currentValue;
      this.previous_value = changes.request.previousValue
      if (JSON.stringify(changes.request.currentValue) !== JSON.stringify(changes.request.previousValue)) {
        this.logger.log('Something has changed')
        // this.REQUEST_HAS_CHANGED = true
        this.appStoreService.requestObjctHasChanged()
      }
    }
    // for TEST
    // this.apps.forEach(app => {
    //   app['iframeUrl'] = app.src + '?email='+ this.request['lead']['email']
    //   console.log('[WS-SIDEBAR-APPS] apps', this.apps)
    // });

  }


  // --------------------------------------------------------------------------------------------------------------------------------
  getIfRouteUrlIsRequestForPanel() {
    this.SIDEBAR_APPS_IN_CHAT_PANEL_MODE = false
    if (this.router.url.indexOf('/request-for-panel') !== -1) {
      this.SIDEBAR_APPS_IN_CHAT_PANEL_MODE = true;
      this.logger.log('[WS-SIDEBAR-APPS] - SIDEBAR_APPS_IN_CHAT_PANEL_MODE »»» ', this.SIDEBAR_APPS_IN_CHAT_PANEL_MODE);

      // const _elemMainPanel = <HTMLElement>document.querySelector('.main-panel')
      // _elemMainPanel.classList.add("main-panel-chat-panel-mode");

    } else {
      this.SIDEBAR_APPS_IN_CHAT_PANEL_MODE = false;
      this.logger.log('[WS-SIDEBAR-APPS] - SIDEBAR_APPS_IN_CHAT_PANEL_MODE »»» ', this.SIDEBAR_APPS_IN_CHAT_PANEL_MODE);
      // const _elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      // if (_elemMainPanel.classList.contains('main-panel-chat-panel-mode')) {
      //   _elemMainPanel.classList.remove("main-panel-chat-panel-mode");
      // }

    }
  }




  getInstallationsPopulateWithApp() {
    let promise = new Promise((resolve, reject) => {
      this.appStoreService.getInstallationWithApp(this.projectId).then((installations: any) => {
        // console.log("[WS-SIDEBAR-APPS] Get Installation Response: ", installations);
        this.apps = []
        this.dashboardApps = []
        this.webchatApps = []

        installations.forEach(installation => {
          //  console.log('getInstallationsPopulateWithApp installation ', installation)
          if (installation.app !== null && installation.app.version === 'v2') {
            // console.log('getInstallationsPopulateWithApp installation.app ', installation.app)


            // this.apps.push(installation.app)

            // this.dashboardApps 
            this.logger.log('getInstallationsPopulateWithApp installation.app  where', installation.app.where)
            if (installation.app.where.dashboard === true) {
              this.dashboardApps.push(installation.app)
            }

            if (installation.app.where.webchat === true) {
              this.webchatApps.push(installation.app)
            }

          }
        });

        this.logger.log("[WS-SIDEBAR-APPS] DASHBOARD APPS ARRAY: ", this.dashboardApps);
        this.logger.log("[WS-SIDEBAR-APPS] WEBCHAT APPS ARRAY: ", this.webchatApps);

        if (this.dashboardApps.length > 0) {
          this.dashboardApps.forEach(app => {
            app['iframeUrl'] = app.runURL + '?request_id=' + this.request['request_id'] + '&project_id=' + this.projectId + '&app_name=' + app.title
            this.logger.log('[WS-SIDEBAR-APPS] apps', this.apps)
            // this.getIframeHasLoaded(app._id) 
          });
        }

        if (this.webchatApps.length > 0) {
          this.webchatApps.forEach(app => {
            app['iframeUrl'] = app.runURL + '?request_id=' + this.request['request_id'] + '&project_id=' + this.projectId + '&app_name=' + app.title
            this.logger.log('[WS-SIDEBAR-APPS] apps', this.apps)
            // this.getIframeHasLoaded(app._id) 
          });
        }
        resolve(installations);
      }).catch((err) => {
        this.logger.error("[WS-SIDEBAR-APPS] Error getting installation: ", err);
        reject(err);
      })
    })
    return promise;
  }
  getIframeHasLoaded(appid, apptitle) {
    var self = this;
    // this.logger.log('[WS-SIDEBAR-APPS] GET iframe appid', appid)
    var iframe = document.getElementById(appid) as HTMLIFrameElement;
    // console.log('[WS-SIDEBAR-APPS] GET iframe ', iframe)
    if (iframe) {

      // this.appsSidebar.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      // iframe.addEventListener("load",  () => {
      // console.log("[WS-SIDEBAR-APPS] GET - Finish Load IFRAME  ", iframe);
      const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
        input !== null && input.tagName === 'IFRAME';

      if (isIFrame(iframe) && iframe.contentWindow) {
        const msg = { appname: apptitle, request: JSON.stringify(this.request) }
        iframe.contentWindow.postMessage(msg, '*');

        // if (this.REQUEST_HAS_CHANGED === true) {
        //   console.log('HERE REQUEST HAS CGAHNGED ')
        //   const msg = { appname: apptitle, request: JSON.stringify(this.current_value) }
        //   iframe.contentWindow.postMessage(msg, '*');
        // }


        this.appStoreService.requestHasChanged$
          .pipe(
            takeUntil(this.unsubscribe$)
          )
          .subscribe((haschanged: boolean) => {
            // console.log('[WS-SIDEBAR-APPS] - +++++>  REQUEST HAS CHANGED ', haschanged)
            this.REQUEST_HAS_CHANGED = haschanged
            if (this.REQUEST_HAS_CHANGED !== null) {
              const msg = { appname: apptitle, request: JSON.stringify(this.current_value) }
              iframe.contentWindow.postMessage(msg, '*');
            }

          });

      }
    }
  }




  closeAppsRightSideBar() {
    this.logger.log('[WS-SIDEBAR-APPS] - closeRightSideBar this.valueChange ', this.valueChange)
   
    this.valueChange.emit(false);
    this.isOpenRightSidebar = false;
    this.appStoreService.setRequestHaChangedToNull();

    // [].forEach.call(
    //   document.querySelectorAll('footer ul li a'),
    //   function (el) {
    //     // this.logger.log('footer > ul > li > a element: ', el);
    //     el.setAttribute('style', 'text-transform: none');
    //   }
    // );

  }




}