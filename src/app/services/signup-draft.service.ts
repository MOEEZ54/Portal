import { Injectable } from '@angular/core';
import { SignupModel } from '../models/signup.model';

type SignupFiles = {
  cnicFront: File;
  cnicBack: File;
  profilePicture: File;
  allotmentLetter?: File;
};

@Injectable({ providedIn: 'root' })
export class SignupDraftService {
  private data?: SignupModel;
  private files?: SignupFiles;

  set(data: SignupModel, files: SignupFiles) {
    // clone data so form changes don’t mutate it
    this.data = JSON.parse(JSON.stringify(data));
    this.files = files;
  }

  getData() { return this.data; }
  getFiles() { return this.files; }

  clear() {
    this.data = undefined;
    this.files = undefined;
  }

  hasDraft() {
    return !!(this.data && this.files);
  }
}
