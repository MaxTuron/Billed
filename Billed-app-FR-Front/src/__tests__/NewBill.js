/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import "@testing-library/jest-dom";
import {screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I click on the browser button and check if the file have the correct extention", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const file = new File(["hello"],'hello.png', { type: 'image/png' });
      const typeFiles = ["image/jpg", "image/png","image/jpeg"]
      await waitFor(() => screen.getByTestId('file'))
      const btnAddFile = screen.getByTestId('file')

      userEvent.upload(btnAddFile, file);

      expect(btnAddFile.files[0]).toStrictEqual(file)
      expect(btnAddFile.files.item(0)).toStrictEqual(file)
      expect(btnAddFile.files).toHaveLength(1)
    })
  })
})
