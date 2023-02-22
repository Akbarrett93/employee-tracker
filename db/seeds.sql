INSERT INTO departments (id, dep_name)
VALUES  (1, "HR"),
        (2, "IT"),
        (3, "R&D"),
        (4, "Production");

INSERT INTO roles (id, title, salary, department_id)
VALUES  (1, "HR Generalist", 75000, 1),
        (2, "IT Manager", 70000, 2),
        (3, "Research Scientist", 90000, 3),
        (4, "Production Manager", 65000, 4),
        (5, "Lab Technician", 50000, 3),
        (6, "Production Associate", 45000, 4);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES  (1, "Paul", "Coffey", 4, NULL),
        (2, "Octavious", "Moore", 6, 4);