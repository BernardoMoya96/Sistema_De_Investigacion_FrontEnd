import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppModalService } from 'src/app/modals/app-modal.service';
import { StaticContentService } from '../static-content.service';

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.css']
})
export class ContentEditorComponent implements OnInit {

  blobInfo:any;
  contentId:number = 0;
  sectionName:string | null | undefined;
  sectionId:number | null | undefined;
  showError:boolean = false;
  researcherId:number | null | undefined;

  tinyMceSettings = {
    plugins: 'image textcolor',
    toolbar: 'undo redo | forecolor backcolor |link image ',
    image_advtab: true,
    height: 500,
    style_formats: [
      {
          title: 'Image Left',
          selector: 'img',
          styles: {
              'float': 'left', 
              'margin': '0 10px 0 10px'
          }
       },
       {
           title: 'Image Right',
           selector: 'img', 
           styles: {
               'float': 'right', 
               'margin': '0 0 10px 10px'
           }
       }
    ],
    /* enable title field in the Image dialog*/
    image_title: true,
    /* enable automatic uploads of images represented by blob or data URIs*/
    automatic_uploads: true,
    /*
      URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
      images_upload_url: 'postAcceptor.php',
      here we add custom filepicker only to Image dialog
    */
    file_picker_types: 'image',
    /* and here's our custom image picker*/
    file_picker_callback: function (callback:any, value:any, meta:any) {
      if (meta.filetype == 'image') {
          var input:any = document.getElementById('my-file');
          input.click();
          input.onchange = function () {
              var file = input.files[0];
              var reader = new FileReader();
              reader.onload = function (e:any) {
                  callback(e.target.result, {
                      alt: file.name
                  });
              };
              reader.readAsDataURL(file);
          };
      }
  },
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
  }


  constructor(private staticContentService: StaticContentService, private route:ActivatedRoute, private modalService: AppModalService) { }

  ngOnInit(): void {  
    this.route.params.subscribe(routeParams => {
      this.sectionName = routeParams.sectionName;
      this.researcherId = routeParams.researcher;
      this.init();
    })  
  }

  init() {
    this.refreshContentFromSection(this.researcherId!,this.sectionName!);
    if (this.sectionName == 'inicio') {
      this.loadCarouselImages(this.researcherId!);
    }
  }

  refreshContentFromSection(researcher:number,sectionName:string) {
    this.staticContentService.getSectionIdByName(sectionName).subscribe(res => {
      this.sectionId = +res;
      if (this.sectionId > 0) {
        this.showError = false;
        this.staticContentService.getContent(researcher, this.sectionId).subscribe((data:any) => {
          if (data && data.key && data.value) {
            this.blobInfo = data.value;
            this.contentId = data.key;
          } else {
            this.blobInfo = "<p></p>";
            this.contentId = 0;
          }
          
        },err=> {
          console.log("err is", err)
        })
      } else {
        this.showError = true;
      }
    });
  }

  fileStrArr:any = [];
  imgIdxArr:any=[];

  loadCarouselImages(researcherId: number) {
   this.staticContentService.getCarousel(researcherId).subscribe(res => {
    this.imgIdxArr = res as Array<any>;
    console.log("carousel images", this.imgIdxArr)
   });
  }

  handleFileChange(event:any, idx:number) {
    let me = this;
    let file = event.target.files[0];
    let fileName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.fileStrArr[idx] = {name:fileName,img:reader.result};
      //console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  handleDescChange($event:any, idx:number) {
    let value = $event.target.value;
    if (this.fileStrArr[idx])
      this.fileStrArr[idx]['desc'] = value;
  }

  addImg() {
    this.imgIdxArr.push({});
  }

  deletedImgs: Array<any> = [];

  removeImg(idx:number) {
    if (this.imgIdxArr[idx] && this.imgIdxArr[idx].name && this.imgIdxArr[idx].id) {
      this.deletedImgs.push({"id":this.imgIdxArr[idx].id,"name":this.imgIdxArr[idx].name})
    }
    this.fileStrArr.splice(idx,1);
    this.imgIdxArr.splice(idx,1);
  }

  save() {
    console.log("imgidxarr", this.imgIdxArr, "filestrarr", this.fileStrArr)

    var enInicio = this.sectionName=='inicio';
    if (enInicio) {
      // delete files from carousel if any
      if (this.deletedImgs.length > 0) {
        console.log("going to delete", this.deletedImgs)
        this.staticContentService.deleteCarouselFiles(this.researcherId!, this.deletedImgs).subscribe(res => {
          console.log("response from deleting images from carousel", res);
          this.deletedImgs = [];
        }, err => {
          return this.modalService.ack("Error", err);
        })
      }
      // save carousel if any
      if (this.fileStrArr.length > 0) {
        let fileArr = [];
        for (let itm of this.fileStrArr) {
          if (itm && itm.img)
            fileArr.push(itm);
        }
        this.staticContentService.saveCarousel(this.researcherId!, fileArr).subscribe(res => {
          console.log("response saving carousel", res)
        }, err => {
          return this.modalService.ack("Error", err);
        })
      }
    }
    // proceed to save static content from rich text editor
    var payload:any = {"idSeccion": this.sectionId, "contenido": this.blobInfo, "idContenido": this.contentId, "idUsuario": this.researcherId};

    this.staticContentService.saveSectionContent(payload).subscribe((res:string) => {
      this.modalService.ack("Operación Exitosa", res);
      if (enInicio) {
        this.makeReadOnlyCarousel();
      }
      this.init();
    }, err => {
      this.modalService.ack("Error", err)
    })
  }


  private makeReadOnlyCarousel() {
    if (this.imgIdxArr.length > 0 && this.fileStrArr.length > 0) {
      let tmp = [];
      for (let itm of this.imgIdxArr) {
        if (itm && itm.name) {
          tmp.push(itm);
        }
      }
      for (let itm of this.fileStrArr) {
        if (itm && itm.name)
          tmp.push({id:itm.id,name:itm.name});
      }
      this.fileStrArr = [];
      this.imgIdxArr = tmp;
      console.log("imgidx after cleanup", this.imgIdxArr)
    }
  }
}
