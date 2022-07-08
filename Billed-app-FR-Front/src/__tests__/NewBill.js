/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from "../views/BillsUI.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills"
import router from "../app/Router"
import store from '../__mocks__/store';

jest.mock('../app/store', () => mockStore);

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

    describe("When I am on NewBill Page", () => {
      test("API test POST", async () => {
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const inputData = {
          vat: "20",
          type: "Hôtel et logement",
          commentary: "",
          name: "AAAZZZaaazz0.123456789",
          date: "2021-11-22",
          amount: "120",
          pct: "20"
        };

        const form = screen.getByTestId("form-new-bill");

        const type = screen.getByTestId("expense-type");
        const name = screen.getByTestId("expense-name");
        const date = screen.getByTestId("datepicker");
        const amount = screen.getByTestId("amount");
        const vat = screen.getByTestId("vat");
        const pct = screen.getByTestId("pct");
        const commentary = screen.getByTestId("commentary");

        fireEvent.change(type, {target: {value: inputData.type}});
        fireEvent.change(name, {target: {value: inputData.name}});
        fireEvent.change(date, {target: {value: inputData.date}});
        fireEvent.change(amount, {target: {value: inputData.amount}});
        fireEvent.change(vat, {target: {value: inputData.vat}});
        fireEvent.change(pct, {target: {value: inputData.pct}});
        fireEvent.change(commentary, {target: {value: inputData.commentary}});


        const HandleSubmit = jest.fn(newBill.handleSubmit);
        form.addEventListener("submit",HandleSubmit);
        fireEvent.submit(form);

        expect(HandleSubmit).toHaveBeenCalled();
      })
    })
  })
})