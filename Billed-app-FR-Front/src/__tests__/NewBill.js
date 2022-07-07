/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import { bills } from "../fixtures/bills.js"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I click on the browser button and check if the file have the correct extention", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const file = new File(["hello"], 'hello.png', {type: 'image/png'});

      await waitFor(() => screen.getByTestId('file'))
      const btnAddFile = screen.getByTestId('file')
      const typeFiles = "image/png"
      await waitFor(() =>
          fireEvent.change(btnAddFile, {
            target: {files: [file]},
          })
      );
      let image = screen.getByTestId("file");
      expect(image.files[0].type).toEqual(typeFiles)
    })

/*
    test("Then I click on the submit button and send the form", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      await waitFor(() => screen.getElementById('btn-send-bill'))
      const btnSendForm = screen.getElementById('btn-send-bill')

      userEvent.click(btnSendForm);
    })
    */
  })
})