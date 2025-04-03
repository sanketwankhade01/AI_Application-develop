import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule] // Add FormsModule to the imports array
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.verifyCredentials(this.username, this.password).then(isValid => {
      if (isValid) {
        this.router.navigate(['/landing']);
      } else {
        alert('Invalid credentials');
      }
    }).catch(error => {
      console.error('Error verifying credentials:', error);
      alert('An error occurred while verifying credentials. Please try again later.');
    });
  }

  async verifyCredentials(username: string, password: string): Promise<boolean> {
    try {
      const url = '../../assets/data/credentials.xlsx';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch the Excel file');
      }
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: { username: string, password: string }[] = XLSX.utils.sheet_to_json(sheet);

      for (let row of jsonData) {
        if ((row as any).username === username && (row as any).password === password) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error reading Excel file:', error);
      throw error;
    }
  }
}
